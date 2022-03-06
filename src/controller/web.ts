import { Http, Registry } from '@symbux/turbo';
import { Inject } from '@symbux/injector';
import ViteProvider from '../provider/vite';

@Http.Controller('/')
export default class WebController {
	@Inject() private vite!: ViteProvider;

	@Http.Get('/')
	public async loadApplication(context: Http.Context): Promise<Http.Response> {
		return await this.vite.handleRequest(context);
	}
}
