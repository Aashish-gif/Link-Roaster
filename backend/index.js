import 'dotenv/config'; // First line
import app from './src/app.js';
import connectDB from './src/db.js';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  // Connect to the database
  await connectDB();

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`[SERVER] Link Roaster API has started successfully!`);
    console.log(`[SERVER] Port: ${PORT}`);
    console.log(`[SERVER] Mode: ${NODE_ENV}`);
    console.log(`[SERVER] Health Check: http://localhost:${PORT}/health`);
    console.log(`==================================================`);
  });
}

startServer();
