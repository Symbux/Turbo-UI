import express from 'express';
import { createServer } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

(async function() {
	const app = express();

	const vite = await createServer({
		server: {
			middlewareMode: 'ssr',
			hmr: {
				port: 5057,
			},
		},
	});

	app.use(vite.middlewares);

	app.use('*', async (request: express.Request, response: express.Response, next: express.NextFunction) => {

		const url = request.originalUrl;

		try {

			let template = readFileSync(resolve(__dirname, './index.html'), 'utf8');
			template = await vite.transformIndexHtml(url, template);
			const { render } = await vite.ssrLoadModule('/src/entry-server.ts');
			const appHtml = await render(url);
			const html = template.replace('<!--ssr-outlet-->', appHtml);

			response.status(200).set({ 'Content-Type': 'text/html' }).end(html);

		} catch(err) {
			vite.ssrFixStacktrace(err as Error);
			next(err as Error);
		}
	});

	app.listen(5056);
})();
