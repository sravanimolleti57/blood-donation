const User = require('../models/User');

const seedAdminAccount = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bloodconnect.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '9876543210',
        role: 'admin',
        city: 'Metropolis',
        address: 'BloodConnect HQ, Central Healthcare Zone',
        verified: true,
        available: true,
      });
      console.log(`[Seed Admin] Built-in Admin account created: ${adminEmail}`);
    } else {
      console.log(`[Seed Admin] System Admin account already exists (${adminEmail}).`);
    }
  } catch (error) {
    console.error(`[Seed Admin Error] ${error.message}`);
  }
};

module.exports = seedAdminAccount;
