import { UserConfig } from 'vite';

export interface IOptions {
	environment?: 'development' | 'production';
	disableAutoCompile?: boolean;
	applications?: Array<IWebAppConfig>;
}

export interface IWebAppConfig {
	viteConfig: UserConfig;
	rootDir: string;
	outDir: string;
	urlPath: string;
}
