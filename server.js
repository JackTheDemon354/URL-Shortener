const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const DATA_FILE = 'urls.json';
let urls = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : {};

function saveUrls() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(urls, null, 2));
}

function generateId() {
  return Math.random().toString(36).substring(2, 8);
}

// API: Shorten URL
app.post('/shorten', (req, res) => {
  const longUrl = req.body.url;
  const id = generateId();
  urls[id] = longUrl;
  saveUrls();
  const fullShortUrl = `${req.protocol}://${req.get('host')}/${id}`;
  res.json({ short: fullShortUrl });
});

// Redirect to long URL
app.get('/:id', (req, res) => {
  const longUrl = urls[req.params.id];
  if (longUrl) return res.redirect(longUrl);
  res.status(404).send('URL not found.');
});

app.listen(PORT, () => console.log(`URL Shortener running on port ${PORT}`));
