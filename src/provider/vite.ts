import { Inject, Provide } from '@symbux/injector';
import { ILogger, Http, Registry } from '@symbux/turbo';
import { createServer, ViteDevServer, build, InlineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import { IOptions } from '../type/structure';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

@Provide()
export default class ViteProvider {
	@Inject('tp.http') private httpService!: Http.Service;
	@Inject('tp.ui.options') private options!: IOptions;
	@Inject('logger') private logger!: ILogger;
	private vite?: ViteDevServer;

	public async initialise(): Promise<void> {

		// Log initialising.
		this.logger.info('PLUGIN:VITE', 'Vite provider initialised.');

		// Check for valid applications.
		if (!this.options || !this.options.applications || this.options.applications.length === 0) {
			this.logger.warn('PLUGIN:VITE', 'No applications defined.');
			return;
		}

		// Check the environment.
		if (Registry.get('turbo.mode') !== 'production') {
			await this.createDevServer();
		}
	}

	private async createDevServer(): Promise<void> {

		// Setup the application.
		this.vite = await createServer(this.getConfig());

		// Use the middlewares.
		const httpServer = this.httpService.getInstance();
		httpServer.use(this.vite.middlewares);

		// Setup dev server listener.
		httpServer.use('*', async (request, response, next) => {
			if (!this.vite) return next();
			try {

				// Define the url.
				const url = request.originalUrl;

				// Setup the template.
				let template = await readFile(resolve(process.cwd(), './web/index.html'), 'utf8');
				template = await this.vite.transformIndexHtml(url, template);

				// Render the output
				const { render } = await this.vite.ssrLoadModule('/src/entry-server.ts');
				const appHtml = await render(url);

				// Replace the HTML and return it.
				const html = template.replace('<!--ssr-outlet-->', appHtml);
				response.status(200).set({ 'Content-Type': 'text/html' }).end(html);

			} catch(err) {

				// Fix the stack trace and return the error.
				this.vite.ssrFixStacktrace(err as Error);
				next(err as Error);
			}
		})
	}

	public async handleRequest(context: Http.Context): Promise<Http.Response> {
		try {

			// Define production.
			const isProduction = Registry.get('turbo.mode') === 'production';

			// If development.
			if (!isProduction) {

				// If no server, return.
				if (!this.vite) {
					return new Http.Response(500, 'Vite dev server not initialised.');
				}

				// Define the URL and transform the index.
				const url = context.getRaw().originalUrl;
				const baseIndex = await readFile(resolve(process.cwd(), './web/index.html'), 'utf8');
				const templateHtml = await this.vite.transformIndexHtml(url, baseIndex);

				// Load the SSR module.
				const { render } = await this.vite.ssrLoadModule(`/src/entry-server.ts`);

				let [ appHtml, preloadLinks ] = await render(url);
				appHtml = templateHtml
					.replace('<!--ssr-outlet-->', appHtml)
					.replace('<!--preload-links-->', preloadLinks);

				// Return a 200, with the content.
				return new Http.Response(200, appHtml);

			// If production.
			} else {

				// Define the manifest.
				const manifest = await readFile(resolve(process.cwd(), './web/dist/server/ssr-manifest.json'), 'utf8');

				// Define the URL and the index template and load the SSR module.
				const url = context.getRaw().originalUrl;
				const templateHtml = await readFile(resolve(process.cwd(), './web/dist/client/index.html'), 'utf8');
				const { render } = require(resolve(process.cwd(), './web/dist/server/entry-server.js'));

				// Render the app HTML.
				let [ appHtml, preloadLinks ] = await render(url, manifest);
				appHtml = templateHtml
					.replace('<!--ssr-outlet-->', appHtml)
					.replace('<!--preload-links-->', preloadLinks);

				// Return a 200, with the content.
				return new Http.Response(200, appHtml);
			}

			// // If no server, return.
			// if (!this.vite && !ssr) {
			// 	return new Http.Response(500, 'Vite dev server not initialised.');
			// }

			// // Check if production.
			// let manifest: any;
			// if (ssr) {
			// 	manifest = await readFile(resolve(process.cwd(), './web/dist/ssr-manifest.json'), 'utf8');
			// }

			// // Define the URL and transform the index.
			// const url = context.getRaw().originalUrl;
			// const isAdmin = url.startsWith('/admin');
			// const baseIndex = await readFile(resolve(process.cwd(), ssr ? './web/dist/client/index.html' : './web/index.html'), 'utf8');
			// const templateHtml = await this.vite.transformIndexHtml(url, baseIndex);

			// // Load the SSR module.
			// const { render } = ssr
			// 	? await this.vite.ssrLoadModule(`${isAdmin ? '/admin' : ''}/src/entry-server.ts`)
			// 	: require(resolve(process.cwd(), './web/dist/server/entry-server.js'));

			// // Render the app HTML.
			// let [ appHtml, preloadLinks ] = await render(url, manifest);
			// appHtml = templateHtml
			// 	.replace('<!--ssr-outlet-->', appHtml)
			// 	.replace('<!--preload-links-->', preloadLinks);

			// // Return a 200, with the content.
			// return new Http.Response(200, appHtml);

		} catch(err) {

			// Return a 500 if there is an error.
			return new Http.Response(500, (err as Error).message);
		}
	}

	public async buildApplication(ssr = false): Promise<void> {
		await build(this.getConfig(ssr));
	}

	private getConfig(ssr = false): InlineConfig {
		return {
			configFile: false,
			envFile: false,
			root: resolve(process.cwd(), './web'),
			base: '/',
			plugins: [vuePlugin()],
			server: {
				middlewareMode: 'ssr',
				hmr: {
					port: 5501,
				},
			},
			build: ssr ? {
				ssr: resolve(process.cwd(), './web/src/entry-server.ts'),
				ssrManifest: true,
				outDir: resolve(process.cwd(), './web/dist/server'),
			} : {
				outDir: resolve(process.cwd(), './web/dist/client'),
			},
		};
	}
}
