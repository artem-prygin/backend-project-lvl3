import path from 'path';
import fsPromises from 'fs/promises';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import { formatName, generateBasename, generateAssetsDirName, generateAssetsDirPath } from './helpers.js';

const assetsMapping = [
	{
		tagName: 'img',
		attribute: 'src',
		extensions: ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'],
	},
	{
		tagName: 'link',
		attribute: 'href',
		extensions: ['.css'],
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
	console.log(url);
	const $ = cheerio.load(htmlData);
	const basename = generateBasename(url);
	const assetsDirName = generateAssetsDirName(url);

	const assets = $('img[src], link[href], script[src]').toArray();
	const assetsPromises = assets.map((asset) => {
		const assetInfo = assetsMapping.find((el) => el.tagName === $(asset)[0].name);
		const assetLink = $(asset).attr(assetInfo.attribute);
		const { pathname: assetPathname, href: assetHref } = new URL(assetLink, url.origin);
		console.log(assetLink);

		if (assetLink !== url.href && assetLink === assetHref) {
			return Promise.resolve();
		}

		const assetExtension = path.parse(assetPathname).ext;
		const assetFilenameRaw = path.parse(assetPathname).name;
		const assetFilename = `${basename}-${formatName(assetFilenameRaw)}${assetExtension}`;
		const newAssetPath = path.join(assetsDirName, assetFilename);

		if (assetLink === url.href || !assetInfo.extensions.includes(assetExtension)) {
			$(asset).attr(assetInfo.attribute, `${newAssetPath}.html`);
			return Promise.resolve();
		}

		$(asset).attr(assetInfo.attribute, newAssetPath);

		return axios.get(assetHref, { responseType: 'arraybuffer' })
			.then((res) => writeFile(newAssetPath, res.data));
	});

	const htmlPath = path.join(outputDir, `${basename}.html`);
	return Promise.all(assetsPromises)
		.then(() => writeFile(htmlPath, $.html()));
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
