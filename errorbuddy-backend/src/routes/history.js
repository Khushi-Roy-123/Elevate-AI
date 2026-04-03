const express = require('express');
const router = express.Router();

// In-memory history store (replace with DB in production)
let history = [];

router.get('/', (req, res) => {
  res.json(history.slice().reverse());
});

router.post('/', (req, res) => {
  const entry = { id: Date.now().toString(), ...req.body, timestamp: new Date().toISOString() };
  history.push(entry);
  if (history.length > 50) history = history.slice(-50);
  res.json(entry);
});

router.delete('/:id', (req, res) => {
  history = history.filter(h => h.id !== req.params.id);
  res.json({ ok: true });
});

module.exports = router;
