import { Inject } from '@symbux/injector';
import Engine, { Event, Http, ILogger } from '@symbux/turbo';
import { IOptions } from '../type/general';
import ViteProvider from '../provider/vite';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

@Event.Listener()
export default class ViteHandler {
	@Inject('logger') private logger!: ILogger;
	@Inject('turbo.core') private engine!: Engine;
	@Inject() private vite!: ViteProvider;

	public constructor(private options: IOptions) {}

	@Event.On.AfterInit(true)
	public async initialise(): Promise<void> {
		this.logger.verbose('PLUGIN:VITE', '[VITE]: Vite handler initialised.');
		await this.vite.initialise();
		this.logger.verbose('PLUGIN:VITE', '[VITE]: Successfully initialised the vite provider.');
	}

	@Event.On.AfterInit(true)
	public async compile(): Promise<void> {
		if (this.options.disableCompile) return;
		if (this.vite.shouldCompile()) {

			// Compile the client bundle.
			this.logger.verbose('PLUGIN:VITE', '[VITE]: Compiling the client bundle...');
			await this.vite.buildApplication();
			this.logger.verbose('PLUGIN:VITE', '[VITE]: Successfully compiled the client bundle.');

			// Compile the server bundle.
			this.logger.verbose('PLUGIN:VITE', '[VITE]: Compiling the server bundle...');
			await this.vite.buildApplication(true);
			this.logger.verbose('PLUGIN:VITE', '[VITE]: Successfully compiled the server bundle.');
		}
	}

	@Event.On.BeforeInit(true)
	public async autoRouting(): Promise<void> {
		if (this.options.disableAutoRouting) return;

		// Define the base path.
		const basePath = this.options.basePath || '/';

		// Get the router path.
		const webPath = this.options.root || resolve(process.cwd(), './web');
		const routerPath = this.options.routerPath || existsSync(resolve(webPath, './src/router/index.ts'))
			? resolve(webPath, './src/router/index.ts')
			: resolve(webPath, './src/router/index.js');

		// Load the router and path match the defined routes.
		const router = await readFile(routerPath, 'utf8');
		const matchRoutesRegex = /path:\\ \\'(.*?)\\'/gm;
		const matchedPathsRaw = router.match(matchRoutesRegex);
		if (!matchedPathsRaw) return;

		// Now clean the strings.
		const matchedPaths = matchedPathsRaw.map(path => {
			return path
				.replaceAll('path: \'', '')
				.replaceAll('\'', '');
		});

		// Now create a new class for the auto routing.
		@Http.Controller(basePath)
		class ViteAutoRouting {
			@Inject() private vite!: ViteProvider;

			@Http.Get(matchedPaths)
			public async get(context: Http.Context): Promise<Http.Response> {
				return await this.vite.handleRequest(context);
			}
		}

		// Now register with the engine.
		this.engine.registerSingle(ViteAutoRouting, {});
	}
}
