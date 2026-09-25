const User = require('../models/User');

const seedAdminAccount = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@bloodconnect.org').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'AdminPassword123!').trim();

    let admin = await User.findOne({ email: adminEmail }).select('+password');
    if (!admin) {
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
        isActive: true,
      });
      console.log(`[Seed Admin] Built-in Admin account created: ${adminEmail}`);
    } else {
      let needsSave = false;
      const isMatch = await admin.matchPassword(adminPassword);
      if (!isMatch) {
        admin.password = adminPassword; // Hashed automatically by User pre('save') hook
        needsSave = true;
      }
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        needsSave = true;
      }
      if (admin.isActive === false) {
        admin.isActive = true;
        needsSave = true;
      }

      if (needsSave) {
        await admin.save();
        console.log(`[Seed Admin] Admin account synchronized with current configuration (${adminEmail}).`);
      } else {
        console.log(`[Seed Admin] System Admin account verified and in sync (${adminEmail}).`);
      }
    }
  } catch (error) {
    console.error(`[Seed Admin Error] ${error.message}`);
  }
};

module.exports = seedAdminAccount;
