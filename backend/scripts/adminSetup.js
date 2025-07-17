import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Meal from '../models/Meal.js';
import Workout from '../models/Workout.js';
import Subscription from '../models/Subscription.js';
import UserMeal from '../models/UserMeal.js';
import UserWorkout from '../models/UserWorkout.js';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness_management');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Create admin user
const createAdmin = async () => {
  try {
    console.log('🔧 Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create admin user
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@gmail.com',
      password: hashedPassword,
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

// Reset database (optional)
const resetDatabase = async () => {
  try {
    console.log('🗑️  Resetting database...');
    
    // Drop all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`   Dropped collection: ${collection.name}`);
    }
    
    console.log('✅ Database reset completed!');
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    throw error;
  }
};

// Seed sample data (optional)
const seedSampleData = async () => {
  try {
    console.log('🌱 Seeding sample data...');
    
    // Create sample meals
    const sampleMeals = [
      {
        name: 'Grilled Chicken Salad',
        description: 'Fresh mixed greens with grilled chicken breast',
        calories: 350,
        protein: 35,
        carbs: 15,
        fat: 18,
        ingredients: ['chicken breast', 'mixed greens', 'tomatoes', 'cucumber', 'olive oil'],
        instructions: 'Grill chicken, mix with fresh vegetables, drizzle with olive oil',
        category: 'lunch',
        dietaryTags: ['high-protein', 'low-carb'],
        prepTime: 20,
        difficulty: 'easy'
      },
      {
        name: 'Protein Smoothie Bowl',
        description: 'Nutritious smoothie bowl with fruits and protein powder',
        calories: 280,
        protein: 25,
        carbs: 35,
        fat: 8,
        ingredients: ['protein powder', 'banana', 'berries', 'almond milk', 'granola'],
        instructions: 'Blend ingredients, top with granola and fresh fruits',
        category: 'breakfast',
        dietaryTags: ['high-protein', 'vegetarian'],
        prepTime: 10,
        difficulty: 'easy'
      }
    ];
    
    await Meal.insertMany(sampleMeals);
    console.log('   ✅ Sample meals created');
    
    // Create sample workouts
    const sampleWorkouts = [
      {
        name: 'Full Body Strength Training',
        description: 'Complete full body workout for strength building',
        category: 'strength',
        difficulty: 'intermediate',
        duration: 45,
        exercises: [
          {
            name: 'Push-ups',
            sets: 3,
            reps: 12,
            duration: null,
            restTime: 60,
            instructions: 'Keep body straight, lower chest to ground'
          },
          {
            name: 'Squats',
            sets: 3,
            reps: 15,
            duration: null,
            restTime: 60,
            instructions: 'Lower until thighs parallel to ground'
          }
        ],
        equipment: ['none'],
        targetMuscles: ['chest', 'legs', 'core'],
        caloriesBurned: 300
      }
    ];
    
    await Workout.insertMany(sampleWorkouts);
    console.log('   ✅ Sample workouts created');
    
    console.log('✅ Sample data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding sample data:', error.message);
    throw error;
  }
};

// Main execution function
const main = async () => {
  try {
    console.log('🚀 Starting admin setup script...');
    console.log('================================');
    
    await connectDB();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const shouldReset = args.includes('--reset');
    const shouldSeed = args.includes('--seed');
    
    if (shouldReset) {
      await resetDatabase();
    }
    
    await createAdmin();
    
    if (shouldSeed) {
      await seedSampleData();
    }
    
    console.log('================================');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Password: admin123');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Script interrupted');
  await mongoose.connection.close();
  process.exit(0);
});

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  createAdmin,
  resetDatabase,
  seedSampleData,
  connectDB
};