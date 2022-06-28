import { Http } from '@symbux/turbo';
import { TaskItem } from '../types/general';

@Http.Controller('/api/task')
export default class TaskApiController {
	private tasks: TaskItem[] = [
		{ name: 'Daily scrum', description: 'Complete and participate in the dailu scrum.', completed: false },
		{ name: 'Read through tasks', description: 'Read through my tasks, and sort by importance.', completed: false },
		{ name: 'Work on tasks', description: 'Start working on the tasks in order of importance.', completed: false },
		{ name: 'Note time', description: 'Notify to our time tracker how long I spent on each task.', completed: false },
	];

	@Http.Get('/')
	public async getTasks(): Promise<Http.Response> {
		return new Http.Response(200, this.tasks);
	}

	@Http.Post('/')
	public async createTask(context: Http.Context): Promise<Http.Response> {
		const { name, description, completed } = context.getBody();
		const newTask = { name, description, completed: completed || false };
		this.tasks.push(newTask);
		return new Http.Response(201, newTask);
	}

	@Http.Delete('/:id')
	public async deleteTask(context: Http.Context): Promise<Http.Response> {
		const { id } = context.getParams();
		const task = this.tasks.find(t => t.name === id);
		if (!task) {
			return new Http.Response(404, 'Task not found.');
		}
		this.tasks = this.tasks.filter(t => t.name !== id);
		return new Http.Response(204);
	}
}
