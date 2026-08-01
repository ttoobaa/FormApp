import app from './app';
import { connectDB } from './db/connection';
import { config } from './config';

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
