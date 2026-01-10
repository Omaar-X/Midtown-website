const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create initial admin user if not exists
    const User = require('../models/User');
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        phone: '01700000000',
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        emailVerified: true
      });
      console.log('✅ Initial admin user created');
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;