import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from 'vue-router';

export function createRouter() {
	return _createRouter({
		// @ts-ignore env.SSR is injected by Vite.
		history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
		routes: [
			{
				path: '/',
				name: 'Home',
				component: () => import('../view/Home.vue'),
			},
			{
				path: '/about',
				name: 'About',
				component: () => import('../view/About.vue'),
			},
		],
	});
}
