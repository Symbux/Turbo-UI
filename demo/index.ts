import { Engine, HttpPlugin, Registry } from '@symbux/turbo';
import VitePlugin from '../src/index';
import { resolve } from 'path';
import { config as configureDotenv } from 'dotenv';
import VueVitePlugin from '@vitejs/plugin-vue';

// Prepare dotenv.
configureDotenv();

// Initialise engine.
const engine = new Engine({
	autowire: true,
	logLevels: ['info', 'warn', 'error', 'verbose', 'debug'],
	errors: {
		continue: true,
	},
	basepath: {
		source: resolve(__dirname),
		compiled: resolve(__dirname),
	},
});

// Register the http plugin.
engine.use(new HttpPlugin({
	port: 5500,
	static: String(process.env.VITE_ENV) === 'production' || Registry.get('turbo.mode') === 'production' ? [
		{ folder: resolve(process.cwd(), './web/dist/client/assets'), pathname: '/assets' },
		{ folder: resolve(process.cwd(), './web/dist/client/'), pathname: '/' },
	] : undefined,
	security: {
		disablePoweredBy: true,
		enableHelmet: true,
		helmetOptions: {
			contentSecurityPolicy: false,
			nocache: false,
		},
	},
}));

// Register the Vite plugin.
engine.use(new VitePlugin({
	environment: String(process.env.VITE_ENV) === 'production' ? 'production' : 'development',
	root: resolve(process.cwd(), './web'),
	plugins: [ VueVitePlugin() ],
	basePath: '/',
	buildOutput: resolve(process.cwd(), './web/dist'),
}));

// Start engine.
engine.start().catch(err => {
	console.error(err);
});
