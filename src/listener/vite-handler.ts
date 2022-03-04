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
		const internalMode: 'development' | 'production' = Registry.get('turbo.mode');
		if (internalMode === 'production') {
			this.logger.verbose('PLUGIN:UI', '[VITE]: Compiling the application for client...');
			await this.vite.buildApplication();
			this.logger.verbose('PLUGIN:UI', '[VITE]: Successfully compiled the client bundle.');
			this.logger.verbose('PLUGIN:UI', '[VITE]: Compiling the application for server...');
			await this.vite.buildApplication(true);
			this.logger.verbose('PLUGIN:UI', '[VITE]: Successfully compiled the server bundle.');
		}
	}
}
