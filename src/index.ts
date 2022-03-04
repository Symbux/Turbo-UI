import Engine, { IPlugin } from '@symbux/turbo';
import { Injector } from '@symbux/injector';
import { IOptions } from './type/structure';
import WebController from './controller/web';
import ViteHandler from './listener/vite-handler';
import ViteProvider from './provider/vite';
import TaskApiController from './controller/task';

/**
 * The UI plugin.
 * All exports for the UI plugin.
 *
 * @exports { AdminController, TaskApiController, ViteHandler }
 */
export {
	WebController,
	TaskApiController,
	ViteHandler,
	ViteProvider,
};

/**
 * The UI plugin for the Turbo engine.
 * Comes with a bot and command structure following standard turbo engine
 * controllers, alongside an OAuth2 helper for managing authentication.
 *
 * @plugin Turbo-UI
 */
export default class Plugin implements IPlugin {
	public name = 'ui';
	public version = '0.1.0';

	public constructor(private options: IOptions) {
		Injector.register('tp.ui.options', this.options);
	}

	public install(engine: Engine): void {

		// Define base params.
		const registerOptions = { options: this.options };

		// Register the modules.
		engine.registerSingle(ViteProvider, registerOptions);
		engine.registerSingle(ViteHandler, registerOptions);
		engine.registerSingle(WebController, registerOptions);
		engine.registerSingle(TaskApiController, registerOptions);
	}
}
