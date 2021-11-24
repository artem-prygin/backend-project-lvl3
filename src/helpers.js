import path from 'path';

export const formatName = (str) => {
	return str
		.match(/\w*/gi)
		.filter((x) => x)
		.join('-');
};

export const generateAssetsBasename = (url) => formatName(url.hostname);

export const generateHTMLBasename = (url) => {
	const nameRaw = path.join(url.hostname, url.pathname);
	return formatName(nameRaw);
};

export const generateAssetsDirName = (url) => `${generateHTMLBasename(url)}_files`;

export const generateAssetsDirPath = (url, outputDir) => path
	.join(outputDir, generateAssetsDirName(url));
