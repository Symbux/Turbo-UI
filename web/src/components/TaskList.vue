<template>
	<table class="table is-striped is-hoverable is-fullwidth">
		<thead>
			<tr>
				<th>Name</th>
				<th>Description</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(task, index) in tasks" :key="index" :class="{ 'is-selected': task.completed }">
				<td>{{ task.name }}</td>
				<td>{{ task.description }}</td>
				<td>{{ task.completed ? '✔️' : '❌' }}</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<td colspan="3">{{ tasks.length }} Item(s)</td>
			</tr>
		</tfoot>
	</table>
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
	tr > th:nth-child(1) {
		width: 15%;
	}

	tr > th:nth-child(3) {
		width: 10%;
	}
</style>
