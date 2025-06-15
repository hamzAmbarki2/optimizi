import express from 'express';
import cors from 'cors';
import geocodeProxy from './geocodeProxy.js';

const app = express();

app.use(cors()); // Allow all origins for development

app.use('/api', geocodeProxy);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// No module.exports needed in ESM