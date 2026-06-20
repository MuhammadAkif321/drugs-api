const express = require('express');
const cors = require('cors');
const drugsData = require('./drugs.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const drugs = drugsData.drugs;

app.get('/', (req, res) => {
  res.json({ message: '💊 Drugs API is Running!' });
});

app.get('/api/drugs', (req, res) => {
  res.json({ success: true, total: drugs.length, drugs });
});

app.get('/api/drugs/popular', (req, res) => {
  const popular = drugs.filter(d => d.popular === true);
  res.json({ success: true, drugs: popular });
});

app.get('/api/drugs/search', (req, res) => {
  const query = req.query.q?.toLowerCase().trim();
  if (!query) return res.status(400).json({ message: 'Provide search query' });
  const results = drugs.filter(d =>
    d.f?.toLowerCase().includes(query) ||
    d.searchTerms?.some(t => t.includes(query)) ||
    d.b?.some(b => b.toLowerCase().includes(query))
  );
  res.json({ success: true, total: results.length, drugs: results });
});

app.get('/api/drugs/:id', (req, res) => {
  const drug = drugs.find(d => d.id === req.params.id.toLowerCase());
  if (!drug) return res.status(404).json({ message: 'Drug not found' });
  res.json({ success: true, drug });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
