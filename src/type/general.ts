import { UserConfig, Plugin, ServerOptions } from 'vite';

export interface IOptions {
	environment?: 'development' | 'production';
	root?: string;
	plugins?: Plugin[];
	basePath?: string;
	buildOutput?: string;
	serverOptions?: ServerOptions;
	disableAutoRouting?: boolean;
	disableCompile?: boolean;
	routerPath?: string;
	customViteConfig?: (ssr: boolean) => UserConfig;
}
