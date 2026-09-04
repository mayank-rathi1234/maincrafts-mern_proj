const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI in MONGO_URI.
 * Exits the process on failure so process managers (nodemon, pm2, Docker)
 * can restart cleanly rather than run with a dead DB connection.
 */
async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not set. Copy .env.example to .env and configure it.');
    }

    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    return conn;
  } catch (err) {
    console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
