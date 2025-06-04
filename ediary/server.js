const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'entries.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
fs.ensureFileSync(DATA_FILE);

function readEntries() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
}

function writeEntries(entries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

app.get('/api/entries', (req, res) => {
  res.json(readEntries());
});

app.post('/api/entries', (req, res) => {
  const entries = readEntries();
  const entry = {
    id: Date.now(),
    title: req.body.title || '',
    content: req.body.content || '',
    date: req.body.date ? new Date(req.body.date).toISOString() : new Date().toISOString(),
  };
  entries.push(entry);
  writeEntries(entries);
  res.json(entry);
});

app.put('/api/entries/:id', (req, res) => {
  const entries = readEntries();
  const id = parseInt(req.params.id, 10);
  const entry = entries.find(e => e.id === id);
  if (!entry) return res.status(404).json({error: 'Not found'});
  entry.title = req.body.title || entry.title;
  entry.content = req.body.content || entry.content;
  writeEntries(entries);
  res.json(entry);
});

app.delete('/api/entries/:id', (req, res) => {
  let entries = readEntries();
  const id = parseInt(req.params.id, 10);
  const idx = entries.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({error: 'Not found'});
  const removed = entries.splice(idx, 1)[0];
  writeEntries(entries);
  res.json(removed);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
