import mongoose from 'mongoose';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
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

const subscriptionPlans = [
  {
    name: 'Basic',
    price: 999,
    duration: 'month',
    features: [
      'Access to all workouts',
      'Basic meal plans',
      'Progress tracking',
      'Email support'
    ],
    popular: false,
    description: 'Perfect for beginners starting their fitness journey'
  },
  {
    name: 'Standard',
    price: 1999,
    duration: 'month',
    features: [
      'Access to all workouts',
      'Personalized meal plans',
      'Advanced progress tracking',
      'Priority support',
      'Custom workout creation',
      'Nutrition guidance'
    ],
    popular: true,
    description: 'Most popular choice for serious fitness enthusiasts'
  },
  {
    name: 'Premium',
    price: 2999,
    duration: 'month',
    features: [
      'All Standard features',
      'Personal trainer consultation',
      'Advanced analytics',
      'Unlimited custom workouts',
      '24/7 priority support',
      'Exclusive content access'
    ],
    popular: false,
    description: 'Ultimate fitness experience with premium features'
  },
  {
    name: 'Basic Annual',
    price: 9999,
    duration: 'year',
    features: [
      'Access to all workouts',
      'Basic meal plans',
      'Progress tracking',
      'Email support',
      '2 months free'
    ],
    popular: false,
    description: 'Save 17% with annual Basic plan'
  },
  {
    name: 'Standard Annual',
    price: 19999,
    duration: 'year',
    features: [
      'All Standard monthly features',
      '2 months free',
      'Bonus workout library',
      'Quarterly fitness assessments'
    ],
    popular: true,
    description: 'Best value - Save 17% with annual Standard plan'
  },
  {
    name: 'Premium Annual',
    price: 29999,
    duration: 'year',
    features: [
      'All Premium monthly features',
      '2 months free',
      'Monthly personal trainer sessions',
      'Custom nutrition plans',
      'Exclusive workshops'
    ],
    popular: false,
    description: 'Ultimate annual package with maximum savings'
  }
];

const createMockSubscriptions = async () => {
  try {
    console.log('🔧 Creating mock subscription data...');
    
    const users = await User.find({ role: 'user' }).limit(10);
    
    if (users.length === 0) {
      console.log('⚠️  No regular users found. Creating sample users first...');
      await createSampleUsers();
      return createMockSubscriptions();
    }

    const mockSubscriptions = [];
    const plans = ['basic', 'standard', 'premium'];
    const statuses = ['active', 'expired', 'cancelled'];
    const billingCycles = ['monthly', 'quarterly', 'annually'];
    const paymentMethods = ['credit-card', 'debit-card', 'paypal'];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const plan = plans[Math.floor(Math.random() * plans.length)];
      const status = i < 7 ? 'active' : statuses[Math.floor(Math.random() * statuses.length)];
      const billingCycle = billingCycles[Math.floor(Math.random() * billingCycles.length)];
      
      let price, description;
      switch (plan) {
        case 'basic':
          price = billingCycle === 'monthly' ? 999 : billingCycle === 'quarterly' ? 2799 : 9999;
          description = 'Perfect for getting started with your fitness journey';
          break;
        case 'standard':
          price = billingCycle === 'monthly' ? 1999 : billingCycle === 'quarterly' ? 5699 : 19999;
          description = 'Most popular plan for serious fitness enthusiasts';
          break;
        case 'premium':
          price = billingCycle === 'monthly' ? 2999 : billingCycle === 'quarterly' ? 8499 : 29999;
          description = 'Ultimate fitness experience with personalized support';
          break;
      }
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));
      
      const endDate = new Date(startDate);
      switch (billingCycle) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'annually':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
      
      const subscription = {
        user: user._id,
        plan,
        description,
        status,
        startDate,
        endDate,
        price,
        currency: 'NPR',
        billingCycle,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus: status === 'active' ? 'paid' : 'pending',
        autoRenew: status === 'active',
        usage: {
          workoutsAccessed: Math.floor(Math.random() * 50),
          mealsAccessed: Math.floor(Math.random() * 30),
          analyticsViewed: Math.floor(Math.random() * 20),
          lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
        }
      };
      
      if (status === 'cancelled') {
        subscription.cancellationReason = 'User requested cancellation';
        subscription.cancellationDate = new Date(startDate.getTime() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
      }
      
      mockSubscriptions.push(subscription);
    }
    
    await Subscription.deleteMany({});
    await Subscription.insertMany(mockSubscriptions);
    
    console.log(`✅ Created ${mockSubscriptions.length} mock subscriptions`);
    console.log('   - Active subscriptions:', mockSubscriptions.filter(s => s.status === 'active').length);
    console.log('   - Expired subscriptions:', mockSubscriptions.filter(s => s.status === 'expired').length);
    console.log('   - Cancelled subscriptions:', mockSubscriptions.filter(s => s.status === 'cancelled').length);
    
  } catch (error) {
    console.error('❌ Error creating mock subscriptions:', error.message);
    throw error;
  }
};

const createSampleUsers = async () => {
  try {
    console.log('👥 Creating sample users...');
    
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS',
        role: 'user',
        isEmailVerified: true,
        profile: {
          age: 28,
          gender: 'male',
          height: 175,
          weight: 70,
          activityLevel: 'moderately-active',
          fitnessGoal: 'weight-loss'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS',
        role: 'user',
        isEmailVerified: true,
        profile: {
          age: 25,
          gender: 'female',
          height: 165,
          weight: 60,
          activityLevel: 'very-active',
          fitnessGoal: 'muscle-gain'
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS',
        role: 'user',
        isEmailVerified: true,
        profile: {
          age: 32,
          gender: 'male',
          height: 180,
          weight: 85,
          activityLevel: 'lightly-active',
          fitnessGoal: 'maintenance'
        }
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS',
        role: 'user',
        isEmailVerified: true,
        profile: {
          age: 29,
          gender: 'female',
          height: 170,
          weight: 65,
          activityLevel: 'moderately-active',
          fitnessGoal: 'weight-loss'
        }
      },
      {
        name: 'David Brown',
        email: 'david.brown@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS',
        role: 'user',
        isEmailVerified: true,
        profile: {
          age: 35,
          gender: 'male',
          height: 178,
          weight: 80,
          activityLevel: 'very-active',
          fitnessGoal: 'muscle-gain'
        }
      }
    ];
    
    await User.insertMany(sampleUsers);
    console.log(`✅ Created ${sampleUsers.length} sample users`);
    
  } catch (error) {
    console.error('❌ Error creating sample users:', error.message);
    throw error;
  }
};

const displaySubscriptionPlans = () => {
  console.log('\n📋 Available Subscription Plans:');
  console.log('================================');
  
  subscriptionPlans.forEach((plan, index) => {
    console.log(`\n${index + 1}. ${plan.name} ${plan.popular ? '⭐ (Popular)' : ''}`);
    console.log(`   Price: Rs. ${plan.price}/${plan.duration}`);
    console.log(`   Description: ${plan.description}`);
    console.log(`   Features:`);
    plan.features.forEach(feature => {
      console.log(`     • ${feature}`);
    });
  });
};

const generateRevenueData = async () => {
  try {
    console.log('💰 Generating revenue analytics...');
    
    const subscriptions = await Subscription.find({ paymentStatus: 'paid' });
    
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const monthlyRevenue = subscriptions
      .filter(sub => {
        const paymentDate = new Date(sub.paymentDate || sub.startDate);
        const currentMonth = new Date();
        return paymentDate.getMonth() === currentMonth.getMonth() && 
               paymentDate.getFullYear() === currentMonth.getFullYear();
      })
      .reduce((sum, sub) => sum + sub.price, 0);
    
    const planBreakdown = subscriptions.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n💰 Revenue Summary:');
    console.log('==================');
    console.log(`Total Revenue: Rs. ${totalRevenue.toLocaleString()}`);
    console.log(`This Month: Rs. ${monthlyRevenue.toLocaleString()}`);
    console.log(`Total Subscriptions: ${subscriptions.length}`);
    console.log('\nPlan Distribution:');
    Object.entries(planBreakdown).forEach(([plan, count]) => {
      console.log(`  ${plan}: ${count} subscribers`);
    });
    
  } catch (error) {
    console.error('❌ Error generating revenue data:', error.message);
  }
};

const main = async () => {
  try {
    console.log('🚀 Starting subscription mock script...');
    console.log('=====================================');
    
    await connectDB();
    
    const args = process.argv.slice(2);
    const shouldReset = args.includes('--reset');
    const showPlans = args.includes('--plans');
    const showRevenue = args.includes('--revenue');
    
    if (shouldReset) {
      console.log('🗑️  Resetting subscription data...');
      await Subscription.deleteMany({});
      console.log('✅ Subscription data reset completed!');
    }
    
    if (showPlans) {
      displaySubscriptionPlans();
    }
    
    await createMockSubscriptions();
    
    if (showRevenue) {
      await generateRevenueData();
    }
    
    console.log('\n=====================================');
    console.log('✅ Subscription mock script completed!');
    console.log('\nUsage examples:');
    console.log('  bun run scripts/subscriptionMock.js --reset    # Reset all subscription data');
    console.log('  bun run scripts/subscriptionMock.js --plans    # Show available plans');
    console.log('  bun run scripts/subscriptionMock.js --revenue  # Show revenue analytics');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { subscriptionPlans, createMockSubscriptions, generateRevenueData };