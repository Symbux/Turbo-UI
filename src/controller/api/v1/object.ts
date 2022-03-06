import { Http } from '@symbux/turbo';

@Http.Controller('/api/v1/ui/object')
export default class ObjectController {

	@Http.Get('/')
	public async getObject(context: Http.Context): Promise<Http.Response> {
		return new Http.Response(200, []);
	}
}
