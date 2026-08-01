import app from './app.js';
import { connectDB } from './db/connection.js';
import { config } from './config/index.js';

async function start() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.env} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

start();
