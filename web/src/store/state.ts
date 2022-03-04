import { defineStore } from 'pinia';

export const useUser = defineStore('user', {
	state() {
		return {
			sidebar: false,
		};
	},
	actions: {
		setSidebar(status: boolean) {
			this.sidebar = status;
		},
	},
});
