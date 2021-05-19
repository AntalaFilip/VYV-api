const express = require('express');
const http = require('http');
const cors = require('cors');
const Gallery = require('./gallery');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(process.env.GALLERY_PATH, Gallery);

http.createServer(app).listen(process.env.PORT, () => {
	console.log(`Server running at ${process.env.PORT}`)
});