import path from 'path';
import fsPromises from 'fs/promises';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import prettier from 'prettier';
import {
	formatName,
	generateHTMLBasename,
	generateAssetsBasename,
	generateAssetsDirName,
	generateAssetsDirPath,
} from './helpers.js';

const assetsMapping = [
	{
		tagName: 'img',
		attribute: 'src',
		extensions: ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico'],
	},
	{
		tagName: 'link',
		attribute: 'href',
		extensions: ['.ico', '.png', '.css'],
	},
	{
		tagName: 'script',
		attribute: 'src',
		extensions: ['.js'],
	},
];

const getHTMLByUrl = (url) => axios.get(url.href)
	.then((res) => res.data);

const writeFile = (filepath, data) => fsPromises.writeFile(filepath, data)
	.then(() => filepath);

const saveAssets = (htmlData, url, outputDir) => {
	const $ = cheerio.load(htmlData);
	const htmlBasename = generateHTMLBasename(url);
	const assetsBasename = generateAssetsBasename(url);
	const assetsDirName = generateAssetsDirName(url);

	const nodes = $('img[src], link[href], script[src]').toArray();
	const assetsPromises = nodes.map((node) => {
		const assetInfo = assetsMapping.find((el) => el.tagName === $(node)[0].name);
		const nodeLink = $(node).attr(assetInfo.attribute);
		const newUrl = new URL(nodeLink, url.origin);

		/* if link is external continue */
		if (newUrl.origin !== url.origin) {
			return Promise.resolve();
		}

		/* if link is same as url convert it to link to new html file */
		if (newUrl.pathname === url.pathname) {
			$(node).attr(assetInfo.attribute, `${htmlBasename}.html`);
			return Promise.resolve();
		}

		const assetExtension = path.parse(newUrl.pathname).ext;

		/* if extension is not from the list continue */
		if (!assetInfo.extensions.includes(assetExtension)) {
			return Promise.resolve();
		}

		const assetFilenameRaw = path.join(
			path.parse(newUrl.pathname).dir,
			path.parse(newUrl.pathname).name,
		);
		const assetFilename = `${assetsBasename}-${formatName(assetFilenameRaw)}${assetExtension}`;
		const newAssetPath = path.join(assetsDirName, assetFilename);
		$(node).attr(assetInfo.attribute, newAssetPath);

		return axios.get(newUrl.href, { responseType: 'arraybuffer' })
			.then((res) => writeFile(path.join(outputDir, newAssetPath), res.data));
	});

	const htmlPath = path.join(outputDir, `${htmlBasename}.html`);
	const prettifiedHTML = prettier
		.format($.html(), { semi: false, parser: 'html', bracketSameLine: true })
		.trim();
	return Promise.all(assetsPromises)
		.then(() => writeFile(htmlPath, prettifiedHTML));
};

const makeAssetsDir = (htmlData, url, outputDir) => {
	const assetsDirPath = generateAssetsDirPath(url, outputDir);

	if (fs.existsSync(assetsDirPath)) {
		return `Sorry, directory ${assetsDirPath} already exists`;
	}

	return fsPromises.mkdir(assetsDirPath)
		.then(() => saveAssets(htmlData, url, outputDir));
};

export default (url, outputDir) => getHTMLByUrl(url)
	.then((data) => makeAssetsDir(data, url, outputDir));
