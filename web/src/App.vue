<template>
	<header>
		<Header />
	</header>

	<main>
		<router-view v-slot="{ Component }">
			<Suspense>
				<component :is="Component" />
			</Suspense>
		</router-view>
	</main>
</template>

<script setup lang="ts">
	import Header from './partials/Header.vue';
</script>

<style lang="scss">
	// @use './styles';
</style>
