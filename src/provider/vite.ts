import { Inject, Provide } from '@symbux/injector';
import { ILogger, Http, Registry } from '@symbux/turbo';
import { createServer, ViteDevServer, build, InlineConfig } from 'vite';
import { IOptions } from '../type/general';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

@Provide()
export default class ViteProvider {
	@Inject('tp.http') private httpService!: Http.Service;
	@Inject('tp.vite.options') private options!: IOptions;
	@Inject('tp.http.options') private httpOptions!: Http.IOptions;
	@Inject('logger') private logger!: ILogger;
	private vite?: ViteDevServer;
	private webPath!: string;
	private outPath!: string;
	private clientOutPath!: string;
	private serverOutPath!: string;
	private isProductionMode!: boolean;

	public async initialise(): Promise<void> {

		// Log initialising.
		this.logger.info('PLUGIN:VITE', 'Vite provider initialised.');

		// Define the base paths.
		this.webPath = this.options.root || resolve(process.cwd(), './web');
		this.outPath = this.options.buildOutput || resolve(this.webPath, './dist');
		this.clientOutPath = resolve(this.outPath, './client');
		this.serverOutPath = resolve(this.outPath, './server');

		// Define whether production mode (development = vite dev server, production = ssr).
		const isViteProduction = this.options.environment === 'production';
		const isTurboProduction = Registry.get('turbo.mode') === 'production';
		this.isProductionMode = isViteProduction || isTurboProduction;

		// Check the environment.
		if (!this.isProductionMode) {
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
				response.status(200).set({
					// eslint-disable-next-line @typescript-eslint/naming-convention
					'Content-Type': 'text/html',
				}).end(html);

			} catch(err) {

				// Fix the stack trace and return the error.
				this.vite.ssrFixStacktrace(err as Error);
				next(err as Error);
			}
		});
	}

	public async handleRequest(context: Http.Context): Promise<Http.Response> {
		try {

			// If development.
			if (!this.isProductionMode) {

				// If no server, return.
				if (!this.vite) {
					return new Http.Response(500, 'Vite dev server not initialised.');
				}

				// Define the URL and transform the index.
				const url = context.getRaw().originalUrl;
				const baseIndex = await readFile(resolve(this.webPath, './index.html'), 'utf8');
				const templateHtml = await this.vite.transformIndexHtml(url, baseIndex);

				// Load the SSR module.
				const { render } = await this.vite.ssrLoadModule('/src/entry-server.ts');

				const [ appHtml, preloadLinks ] = await render(url);
				const outputHtml = templateHtml
					.replace('<!--ssr-outlet-->', appHtml)
					.replace('<!--preload-links-->', preloadLinks);

				// Return a 200, with the content.
				return new Http.Response(200, outputHtml);

			// If production.
			} else {

				// Define the manifest.
				const manifest = await readFile(resolve(this.serverOutPath, './ssr-manifest.json'), 'utf8');

				// Define the URL and the index template and load the SSR module.
				const url = context.getRaw().originalUrl;
				const templateHtml = await readFile(resolve(this.clientOutPath, './index.html'), 'utf8');
				const { render } = require(resolve(this.serverOutPath, './entry-server.js'));

				// Render the app HTML.
				const [ appHtml, preloadLinks ] = await render(url, manifest);
				const outputHtml = templateHtml
					.replace('<!--ssr-outlet-->', appHtml)
					.replace('<!--preload-links-->', preloadLinks);

				// Return a 200, with the content.
				return new Http.Response(200, outputHtml);
			}

		} catch(err) {

			// Return a 500 if there is an error.
			return new Http.Response(500, (err as Error).message);
		}
	}

	public async buildApplication(ssr = false): Promise<void> {
		await build(this.getConfig(ssr));
	}

	public shouldCompile(): boolean {
		return this.isProductionMode;
	}

	private getConfig(ssr = false): InlineConfig {

		// Build and return the config.
		return {
			root: this.webPath,
			base: this.options.basePath || '/',
			plugins: this.options.plugins || undefined,
			appType: 'custom',
			ssr: {
				format: 'cjs',
				target: 'node',
			},
			server: this.options.serverOptions || {
				middlewareMode: true,
				hmr: {
					port: this.httpOptions.port + 1,
				},
			},
			build: ssr ? {
				ssr: resolve(this.webPath, './src/entry-server.ts'),
				ssrManifest: true,
				outDir: this.serverOutPath,
			} : {
				outDir: this.clientOutPath,
			},
		};
	}
}
