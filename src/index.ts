import Engine, { IPlugin } from '@symbux/turbo';
import { Injector } from '@symbux/injector';
import { IOptions as Options } from './type/structure';
import ViteHandler from './listener/vite-handler';
import ViteProvider from './provider/vite';

/**
 * The UI plugin.
 * All exports for the UI plugin.
 *
 * @exports { AdminController, TaskApiController, ViteHandler }
 */
export {
	ViteHandler,
	ViteProvider,
	Options
};

/**
 * The Vite plugin for the Turbo engine.
 * Supports server-side rending alongside support for
 * the Vite dev server for HMR and live development.
 *
 * @plugin Turbo-Vite
 */
export default class Plugin implements IPlugin {
	public name = 'vite';
	public version = '0.1.0';

	public constructor(private options: Options) {
		Injector.register('tp.vite.options', this.options);
	}

	public install(engine: Engine): void {

		// Register the modules.
		engine.registerSingle(ViteProvider, this.options);
		engine.registerSingle(ViteHandler, this.options);
	}
}
