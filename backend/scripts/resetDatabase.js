import mongoose from 'mongoose';
import User from '../models/User.js';
import Meal from '../models/Meal.js';
import Workout from '../models/Workout.js';
import Subscription from '../models/Subscription.js';
import UserMeal from '../models/UserMeal.js';
import UserWorkout from '../models/UserWorkout.js';
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

const resetDatabase = async () => {
  try {
    console.log('🗑️  Starting database reset...');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('📭 Database is already empty');
      return;
    }
    
    console.log(`🔍 Found ${collections.length} collections to drop:`);
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`✅ Dropped collection: ${collection.name}`);
    }
    
    console.log('🧹 Database reset completed successfully!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    throw error;
  }
};

const createAdmin = async () => {
  try {
    console.log('👤 Creating admin user...');
    
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
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

const main = async () => {
  try {
    console.log('🚀 Starting database reset script...');
    console.log('==========================================');
    
    const args = process.argv.slice(2);
    const createAdminFlag = args.includes('--create-admin');
    
    await connectDB();
    await resetDatabase();
    
    if (createAdminFlag) {
      console.log('\n👤 Creating admin user as requested...');
      await createAdmin();
    }
    
    console.log('\n==========================================');
    console.log('✅ Database reset completed!');
    
    if (createAdminFlag) {
      console.log('👤 Admin user created:');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the default password after first login!');
    } else {
      console.log('💡 Use --create-admin flag to also create an admin user');
    }
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

main();