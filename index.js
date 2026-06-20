const express = require('express');
const cors = require('cors');
const data1 = require('./drugs_firestore.json');
const data2 = require('./drugs.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Combine both files - remove duplicates
const allDrugs = [...data1.drugs, ...data2.drugs].filter(
  (drug, index, self) =>
    index === self.findIndex(d =>
      (d.f || '').toLowerCase() === (drug.f || '').toLowerCase()
    )
);

app.get('/', (req, res) => {
  res.json({
    message: '💊 Drugs API is Running!',
    total: allDrugs.length
  });
});

app.get('/api/drugs', (req, res) => {
  res.json({ success: true, total: allDrugs.length, drugs: allDrugs });
});

app.get('/api/drugs/popular', (req, res) => {
  const popular = allDrugs.filter(d => d.popular === true);
  res.json({ success: true, drugs: popular });
});

app.get('/api/drugs/search', (req, res) => {
  const query = req.query.q?.toLowerCase().trim();
  if (!query) return res.status(400).json({ message: 'Provide search query' });
  const results = allDrugs.filter(d =>
    d.f?.toLowerCase().includes(query) ||
    d.searchTerms?.some(t => t.includes(query)) ||
    d.b?.some(b => b.toLowerCase().includes(query))
  );
  res.json({ success: true, total: results.length, drugs: results });
});

app.get('/api/drugs/:id', (req, res) => {
  const drug = allDrugs.find(d =>
    (d.id || d.f || '').toLowerCase() === req.params.id.toLowerCase()
  );
  if (!drug) return res.status(404).json({ message: 'Drug not found' });
  res.json({ success: true, drug });
});

app.get('/api/category/:category', (req, res) => {
  const results = allDrugs.filter(d =>
    d.c?.toLowerCase().includes(req.params.category.toLowerCase())
  );
  res.json({ success: true, total: results.length, drugs: results });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
