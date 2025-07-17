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

const checkAdmin = async () => {
  try {
    console.log('🔍 Checking admin users...');
    
    const adminUsers = await User.find({ role: 'admin' });
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found');
      return;
    }
    
    console.log(`✅ Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach((admin, index) => {
      console.log(`\nAdmin ${index + 1}:`);
      console.log(`  ID: ${admin._id}`);
      console.log(`  Name: ${admin.name}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Active: ${admin.isActive}`);
      console.log(`  Created: ${admin.createdAt}`);
      console.log(`  Last Login: ${admin.lastLogin || 'Never'}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking admin users:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await checkAdmin();
  } catch (error) {
    console.error('❌ Script error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

main();