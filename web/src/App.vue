<template>
	<header>
		<h1>Turbo UI</h1>
		<nav>
			<router-link to="/">Home</router-link>
			<router-link to="/about">About</router-link>
		</nav>
	</header>

	<main>
		<router-view v-slot="{ Component }">
			<Suspense>
				<component :is="Component" />
			</Suspense>
		</router-view>
	</main>
</template>
