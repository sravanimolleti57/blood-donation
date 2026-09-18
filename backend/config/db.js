const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Safe diagnostic logging (host & database name only - NO credentials)
    try {
      const parsed = new URL(uri);
      console.log('[MongoDB Config] Host:', parsed.hostname);
      console.log('[MongoDB Config] Database:', parsed.pathname);
    } catch (e) {
      // URL parsing fallback
    }

    // Only reject generic placeholder "@cluster.mongodb.net/"
    if (uri.includes('@cluster.mongodb.net/') || uri.includes('YOUR_CLUSTER')) {
      throw new Error('Placeholder cluster hostname detected in MONGODB_URI. Replace "@cluster.mongodb.net/" with your actual cluster hostname.');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB Atlas] Database Name: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error('[MongoDB Atlas Connection Error]');
    const msg = error.message || '';

    if (
      msg.includes('Could not connect to any servers') ||
      msg.includes('MongooseServerSelectionError') ||
      msg.includes('timed out') ||
      msg.includes('ETIMEDOUT')
    ) {
      console.error('Category: Network / IP Whitelist Error');
      console.error('Details: MongoDB Atlas rejected the connection. Render outbound IPs must be allowed.');
      console.error('Action Required: Go to MongoDB Atlas -> Security -> Network Access -> Add IP Address -> Add 0.0.0.0/0 (Allow Access from Anywhere)');
    } else if (msg.includes('bad auth') || msg.includes('AuthenticationFailed') || error.code === 8000) {
      console.error('Category: Authentication Failure');
      console.error('Details: Invalid database username or password.');
      console.error('Action Required: Check database user credentials in MongoDB Atlas -> Security -> Database Access');
    } else if (msg.includes('ENOTFOUND') || msg.includes('querySrv')) {
      console.error('Category: DNS / Hostname Error');
      console.error('Details: Unable to resolve cluster hostname.');
      console.error('Action Required: Verify the hostname in MONGODB_URI environment variable');
    } else {
      console.error(`Message: ${msg}`);
    }

    throw error;
  }
};

module.exports = connectDB;
