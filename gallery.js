const express = require('express');
const fs = require('fs');
const p = require('path');
const manifest = require('./gallery/manifest.json');
require('dotenv').config();

const router = express.Router();

router.get(`/`, (req, res) => {
	const files = fs.readdirSync('./gallery', {withFileTypes: true});

	const galleries = files.filter(file => file.isDirectory()).map(dirent => dirent.name);

	res.send({
		items: galleries.map(gal => {
			const mf = manifest[gal];
			return {
				id: gal,
				name: mf.name,
				desc: mf.desc,
				uri: `${process.env.URL}/gallery/${gal}`
			}
		})
	})
});

router.get(`/:gallery`, (req, res) => {
	const path = `./gallery/${req.params['gallery']}`;
	const exists = fs.existsSync(path);

	if (!exists) return res.status(404).send(`This gallery does not exist!`);

	const mf = manifest[req.params['gallery']];

	const items = fs.readdirSync(path);

	if (!items) return res.status(204).send();


	res.send({
		items: items.map(item => {
			const data = mf.items.find(entry => entry.id === item);

			return {
				id: data ? data.id : item,
				name: data ? data.name : null,
				author: data ? data.author : null,
				description: data ? data.desc : null,
				uri: `${process.env.URL}/gallery/${req.params['gallery']}/${item}`,
			}
		})
	})
});

router.get(`/:gallery/:item`, (req, res) => {
	const path = `./gallery/${req.params['gallery']}/${req.params['item']}`;
	const exists = fs.existsSync(path);

	if (!exists) return res.status(404).send(`The requested item does not exist`);

	res.sendFile(p.join(__dirname, path));
});

module.exports = router;