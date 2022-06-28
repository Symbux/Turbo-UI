import { UserConfig, Plugin, ServerOptions } from 'vite';

export interface IOptions {
	environment?: 'development' | 'production';
	root?: string;
	plugins?: Plugin[];
	basePath?: string;
	buildOutput?: string;
	serverOptions?: ServerOptions;
	customViteConfig?: (ssr: boolean) => UserConfig;
}

export interface IWebAppConfig {
	viteConfig: UserConfig;
	rootDir: string;
	outDir: string;
	urlPath: string;
}
