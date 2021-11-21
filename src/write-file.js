import { writeFile } from 'fs/promises';
import path from 'path';

export default (link, dir, data) => {
	const title = link
		.split('//')[1]
		.replaceAll(/[./]/g, '-');
	const titleWithExt = `${title}.html`;
	return writeFile(path.join(dir, titleWithExt), data)
		.then(() => titleWithExt)
		.catch((e) => console.log(e));
};
