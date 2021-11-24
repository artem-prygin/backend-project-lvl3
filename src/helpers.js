import path from 'path';

export const formatName = (str) => str
	.replace(/www./g, '')
	.replaceAll(/[./]/g, '-')
	.replaceAll(/^-|-$/g, '');

export const generateBasename = (url) => {
	const nameRaw = path.join(url.hostname, url.pathname);
	return formatName(nameRaw);
};

export const generateAssetsDirName = (url) => `${generateBasename(url)}_files`;

export const generateAssetsDirPath = (url, outputDir) => path
	.join(outputDir, generateAssetsDirName(url));
