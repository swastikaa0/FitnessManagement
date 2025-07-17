import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness_management');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    console.log('🔧 Creating admin user...');
    
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      profile: {
        age: 30,
        gender: 'other',
        height: 175,
        weight: 70,
        activityLevel: 'moderately-active',
        fitnessGoal: 'maintenance'
      }
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the default password after first login!');
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

const main = async () => {
  try {
    console.log('🚀 Starting admin creation script...');
    console.log('================================');
    
    await connectDB();
    await createAdmin();
    
    console.log('================================');
    console.log('✅ Admin creation completed!');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Admin creation failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

main();