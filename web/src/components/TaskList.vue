<template>
	<ul>
		<li v-for="(task, index) in tasks" :key="index">
			<h3>{{ task.name }}</h3>
			<p>{{ task.description }}</p>
			<p>{{ task.completed ? 'Done' : 'To-Do' }}</p>
		</li>
	</ul>
</template>

<script setup lang="ts">
	defineProps<{
		tasks: Array<{
			name: string;
			description: string;
			completed: boolean;
		}>
	}>();
</script>

<style scoped lang="scss">
	ul {
		list-style: none;
		padding: 0;
	}
</style>
