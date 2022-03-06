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
		this.logger.verbose('PLUGIN:UI', '[VITE]: Vite handler initialised.');
		await this.vite.initialise();
		this.logger.verbose('PLUGIN:UI', '[VITE]: Successfully initialised the vite provider.');
	}

	@Event.On.BeforeInit(true)
	public async compile(): Promise<void> {
		if (Registry.get('turbo.mode') === 'production') {

			// Compile the client bundle.
			this.logger.verbose('PLUGIN:UI', '[VITE]: Compiling the client bundle...');
			await this.vite.buildApplication();
			this.logger.verbose('PLUGIN:UI', '[VITE]: Successfully compiled the client bundle.');

			// Compile the server bundle.
			this.logger.verbose('PLUGIN:UI', '[VITE]: Compiling the server bundle...');
			await this.vite.buildApplication(true);
			this.logger.verbose('PLUGIN:UI', '[VITE]: Successfully compiled the server bundle.');
		}
	}
}
