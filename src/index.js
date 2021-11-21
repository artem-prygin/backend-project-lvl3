import axios from 'axios';
import abc from './write-file.js';

export default (link, dir) => axios.get(link)
	.then((res) => abc(link, dir, res.data))
	.then((res) => res)
	.catch((e) => console.log(e));
