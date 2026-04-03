require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/explain', require('./src/routes/explain'));
app.use('/api/history', require('./src/routes/history'));

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ErrorBuddy backend running on http://localhost:${PORT}`));
