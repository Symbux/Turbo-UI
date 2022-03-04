import { Engine, HttpPlugin, Registry } from '@symbux/turbo';
import UiPlugin from '../src/index';
import { resolve } from 'path';
import { config as configureDotenv } from 'dotenv';
import vuePlugin from '@vitejs/plugin-vue';

// Prepare dotenv.
configureDotenv();

// Initialise engine.
const engine = new Engine({
	autowire: true,
	logLevels: ['info', 'warn', 'error', 'verbose', 'debug'],
	scanFoldersOnly: true,
	folders: [resolve(__dirname, './demo')],
	basepath: {
		source: resolve(process.cwd(), './demo'),
		compiled: resolve(process.cwd(), './demo'),
	},
});

// Register the http plugin.
engine.use(new HttpPlugin({
	port: 5500,
	static: Registry.get('turbo.mode') === 'production' ? [
		{ folder: resolve(process.cwd(), './web/dist/client/assets'), pathname: '/assets' },
	] : undefined,
}));

// Register the UI plugin.
engine.use(new UiPlugin({
	environment: 'development',
	applications: [
		{
			rootDir: resolve(__filename, '../web/app1'),
			outDir: resolve(__filename, '../web/app1/dist'),
			urlPath: '/webapp1',
			viteConfig: {
				root: resolve(__dirname, '../web/app1'),
				base: '/',
				plugins: [vuePlugin()],
			},
		},
		// {
		// 	rootDir: resolve(__filename, './webapp2'),
		// 	outDir: resolve(__filename, './webapp2/dist'),
		// 	urlPath: '/webapp2',
		// 	viteConfig: {
		// 		root: resolve(__dirname, '../../web'),
		// 		base: '/',
		// 		plugins: [vuePlugin()],
		// 	},
		// },
	],
}));

// Start engine.
engine.start().catch(err => {
	console.error(err);
});
