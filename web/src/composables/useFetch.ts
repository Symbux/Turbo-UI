import { watch, ref, unref, isRef, inject } from 'vue';
import { MaybeRef } from '../types/general';
import { HttpProvider } from '../providers/http';

export default async function useFetch<T>(url: MaybeRef<string>) {

	// Define variables.
	const http = inject<HttpProvider>('http');
	const error = ref<string>('');
	if (!http) {
		error.value = 'No http transport defined.';
	}

	// Load the data.
	const data = ref<T>(
		http
			? await (await http.get(unref(url))).json()
			: [],
	);

	// Watch for changes.
	if (isRef(url)) {
		watch(url, reload);
	}

	// Reload the data.
	async function reload() {
		data.value = http ? await (await http.get(unref(url))).json() : [];
	}

	// Return the data.
	return {
		error,
		data,
		reload,
	};
}
