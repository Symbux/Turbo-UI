import { Inject } from '@symbux/injector';
import { Http } from '@symbux/turbo';
import ViteProvider from '../provider/vite';

@Http.Controller('/admin')
export default class AdminController {
	@Inject() private vite!: ViteProvider;

	@Http.Get('*')
	public async index(context: Http.Context): Promise<Http.Response> {
		return this.vite.handleRequest(context, true);
	}

	@Http.Get('/build')
	public async build(): Promise<Http.Response> {
		await this.vite.buildApplication();
		return new Http.Response(200, 'Successfully built the vite dev server.');
	}
}

