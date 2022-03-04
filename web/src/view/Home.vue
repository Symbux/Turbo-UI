<template>
	<div>
		<h2>Task List</h2>
		<TaskList :tasks="tasks" />

		<h2>Add Task</h2>
		<input type="text" v-model="task.name" />
		<textarea v-model="task.description"></textarea>
		<button @click="addTask">Add Task</button>
	</div>
</template>

<script setup lang="ts">
	import TaskList from '../components/TaskList.vue';
	import fetch from 'cross-fetch';
	import { ref } from 'vue';
	const tasks = ref<any[]>([]);
	const task = ref({
		name: '',
		description: '',
	});

	const addTask = async () => {
		const response = await fetch('/api/task', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(task.value),
		});
		const newTask = await response.json();
		tasks.value.push(newTask);
		task.value.name = '';
		task.value.description = '';
	}

	const response = await fetch('http://localhost:5500/api/task');
	tasks.value = await response.json();
</script>
