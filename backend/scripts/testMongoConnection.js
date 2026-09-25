require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('MongoDB configuration:');
      console.log('URI exists: false');
      console.log('MONGODB LOGIN FAILED');
      console.log('Error category: Environment Error');
      console.log('Message: MONGODB_URI is missing from process.env');
      process.exit(1);
    }

    let username = '';
    let host = '';
    let database = '';
    let passwordLength = 0;

    try {
      const parsed = new URL(uri);
      username = decodeURIComponent(parsed.username || '');
      host = parsed.hostname || '';
      database = parsed.pathname || '';
      const rawPassword = decodeURIComponent(parsed.password || '');
      passwordLength = rawPassword.length;
    } catch (e) {
      console.log('MongoDB configuration:');
      console.log('URI exists: true');
      console.log('URI Parse Error: Failed to parse URL structure safely');
    }

    console.log('MongoDB configuration:');
    console.log('URI exists: true');
    console.log('Username:', username);
    console.log('Host:', host);
    console.log('Database:', database);
    console.log('Password length:', passwordLength);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MONGODB LOGIN SUCCESS');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('MONGODB LOGIN FAILED');
    console.log('Error category:', error.name || 'Authentication/Network Error');
    console.log('Message:', error.message);
    process.exit(1);
  }
};

testConnection();
