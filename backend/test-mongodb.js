require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const mongoose = require('mongoose');

const runTest = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('MONGODB LOGIN FAILED: MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MONGODB LOGIN SUCCESS');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('MONGODB LOGIN FAILED:', error.message);
    process.exit(1);
  }
};

runTest();
