import { Http } from '@symbux/turbo';

@Http.Controller('/api/task')
export default class TaskApiController {
	private tasks: Array<{
		name: string;
		description: string;
		completed: boolean;
	}> = [
		{ name: 'Wash dishes', description: 'Minim non proident tempor consectetur in minim minim consequat officia adipisicing. Laborum officia ullamco minim ad do laborum eiusmod ullamco cupidatat id enim ad. Ad commodo exercitation dolore duis elit enim veniam irure aliqua. Anim minim proident incididunt in. Qui eiusmod nisi pariatur do proident aliqua sint anim. Laborum nostrud elit non occaecat adipisicing dolor voluptate.', completed: false },
	];

	@Http.Get('/')
	public async getTasks(context: Http.Context): Promise<Http.Response> {
		return new Http.Response(200, this.tasks);
	}

	@Http.Post('/')
	public async createTask(context: Http.Context): Promise<Http.Response> {
		const { name, description } = context.getBody();
		const newTask = { name, description, completed: false };
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
