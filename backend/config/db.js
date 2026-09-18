const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in backend/.env');
    }

    // Safe diagnostic logging (host & database name only - NO credentials)
    try {
      const parsed = new URL(uri);
      console.log('[MongoDB Config] Host:', parsed.hostname);
      console.log('[MongoDB Config] Database:', parsed.pathname);
    } catch (e) {
      // URL parsing fallback if non-standard format
    }

    // Only reject the exact generic placeholder "@cluster.mongodb.net/"
    if (uri.includes('@cluster.mongodb.net/') || uri.includes('YOUR_CLUSTER')) {
      throw new Error('Placeholder cluster hostname detected in MONGODB_URI. Please replace "@cluster.mongodb.net/" with your actual cluster hostname in backend/.env.');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB Atlas] Database Name: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error('[MongoDB Atlas Connection Error]');
    console.error(`Message: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
