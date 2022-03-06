import App from './App.vue';
import { createSSRApp } from 'vue';
import { createRouter } from './router';
import httpProvider from './providers/http';
import intlProvider from './providers/intl';
import miscProvider from './providers/misc';
import FontAwesomeIcon from './setup/fontawesome';
import './styles/index.scss';

export function createApp() {
	const app = createSSRApp(App);
	const router = createRouter();
	app.provide('http', httpProvider);
	app.provide('intl', intlProvider);
	app.provide('misc', miscProvider);
	app.component('fa', FontAwesomeIcon);
	app.use(router);
	return { app, router };
}
