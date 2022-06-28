import { Inject } from '@symbux/injector';
import { Event, ILogger, Registry } from '@symbux/turbo';
import { IOptions } from '../type/structure';
import ViteProvider from '../provider/vite';

@Event.Listener()
export default class ViteHandler {
	@Inject('logger') private logger!: ILogger;
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
}
