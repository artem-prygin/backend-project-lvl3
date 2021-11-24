import fsPromises from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../src/index.js';

const fixturesPath = path.join(process.cwd(), '__fixtures__');
const fixturedHTMLFilename = 'ru-hexlet-io-courses.html';
const fixturedHTMLPath = path.join(fixturesPath, fixturedHTMLFilename);
const expectedPath = path.join(fixturesPath, 'expected');
const expectedAssetsPathName = 'ru-hexlet-io-courses_files';
const expectedAssetsPath = path.join(expectedPath, expectedAssetsPathName);
const urlOrigin = 'https://ru.hexlet.io';
const urlPathname = '/courses';
const url = new URL(urlPathname, urlOrigin);
const scope = nock(urlOrigin).persist();

let resources = [
	{
		format: 'link',
		urlPath: '/assets/application.css',
		expectedFilepath: path.join(expectedAssetsPath, 'ru-hexlet-io-assets-application.css'),
		filename: 'ru-hexlet-io-assets-application.css',
	},
	{
		format: 'image',
		urlPath: '/assets/professions/nodejs.png',
		expectedFilepath: path.join(expectedAssetsPath, 'ru-hexlet-io-assets-professions-nodejs.png'),
		filename: 'ru-hexlet-io-assets-professions-nodejs.png',
	},
	{
		format: 'javascript',
		urlPath: '/packs/js/runtime.js',
		expectedFilepath: path.join(expectedAssetsPath, 'ru-hexlet-io-packs-js-runtime.js'),
		filename: 'ru-hexlet-io-packs-js-runtime.js',
	},
];
const formats = resources.map((res) => res.format);

const fileExists = (filepath) => {
	const dirname = path.dirname(filepath);
	const filename = path.basename(filepath);
	return fsPromises.readdir(dirname)
		.then((filenames) => filenames.includes(filename));
};

let tmpDirPath;
let expectedContent;

beforeAll(async () => {
	const fixturedHTMLContent = await fsPromises.readFile(fixturedHTMLPath);
	expectedContent = await fsPromises.readFile(path.join(expectedPath, fixturedHTMLFilename), 'utf-8');
	tmpDirPath = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));

	const promises = resources.map((info) => fsPromises.readFile(info.expectedFilepath)
		.then((data) => ({ ...info, data })));

	resources = await Promise.all(promises);
	scope
		.get(urlPathname)
		.reply(200, fixturedHTMLContent);

	resources.forEach(({ urlPath, data }) => scope
		.get(urlPath)
		.reply(200, data));
});

describe('negative cases', () => {
	test('load page: no response', async () => {
		const invalidBaseUrl = urlOrigin.replace('x', '');
		const expectedError = `getaddrinfo ENOTFOUND ${invalidBaseUrl}`;
		nock(invalidBaseUrl).get('/').replyWithError(expectedError);
		await expect(pageLoader(new URL(invalidBaseUrl), tmpDirPath))
			.rejects.toThrow(expectedError);
	});

	test.each([404, 500])('status code %s', async (code) => {
		scope.get(`/${code}`).reply(code, '');
		await expect(pageLoader(new URL(`/${code}`, urlOrigin), tmpDirPath))
			.rejects.toThrow(`Request failed with status code ${code}`);
	});

	test('file system errors', async () => {
		const rootDirPath = '/sys';
		await expect(pageLoader(url, rootDirPath))
			.rejects.toThrow(`EACCES: permission denied, mkdir '${rootDirPath}/${expectedAssetsPathName}'`);

		await expect(pageLoader(url, fixturedHTMLPath))
			.rejects.toThrow(`ENOTDIR: not a directory, mkdir '${fixturedHTMLPath}`);

		const notExistsPath = path.join(fixturesPath, 'notExistDir');
		await expect(pageLoader(url, notExistsPath))
			.rejects.toThrow(`ENOENT: no such file or directory, mkdir '${notExistsPath}/${expectedAssetsPathName}'`);
	});
});

describe('successful cases', () => {
	test('save html file', async () => {
		await pageLoader(url, tmpDirPath);
		const fileWasCreated = await fileExists(path.join(tmpDirPath, fixturedHTMLFilename));
		expect(fileWasCreated).toBe(true);
		const actualContent = await fsPromises.readFile(path.join(tmpDirPath, fixturedHTMLFilename), 'utf-8');
		expect(actualContent).toBe(expectedContent.trim());
	});

	test.each(formats)('save %s resource', async (format) => {
		const { filename } = resources.find((content) => content.format === format);

		const fileWasCreated = await fileExists(
			path.join(tmpDirPath, expectedAssetsPathName, filename),
		);
		expect(fileWasCreated).toBe(true);
	});
});
