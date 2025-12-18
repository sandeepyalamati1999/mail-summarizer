import express from 'express';
import compression from 'compression';
import fallback from 'express-history-api-fallback';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();

// Helps resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable Gzip compression
app.use(compression());

// Serve static files from the dist directory (output of Vite build)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for client-side routing
app.use(fallback('index.html', { root: path.join(__dirname, 'dist') }));

// Start server on the specified port or 8081
app.listen(process.env.PORT || 8081, () => {
  console.log(`Server is running on port ${process.env.PORT || 8081}`);
});
