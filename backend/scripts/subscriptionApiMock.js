import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

const mockSubscriptionPlans = [
  {
    _id: '507f1f77bcf86cd799439011',
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
    description: 'Perfect for beginners starting their fitness journey',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439012',
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
    description: 'Most popular choice for serious fitness enthusiasts',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439013',
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
    description: 'Ultimate fitness experience with premium features',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439014',
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
    description: 'Save 17% with annual Basic plan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439015',
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
    description: 'Best value - Save 17% with annual Standard plan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439016',
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
    description: 'Ultimate annual package with maximum savings',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockUserSubscriptions = [
  {
    _id: '507f1f77bcf86cd799439021',
    user: '507f1f77bcf86cd799439001',
    plan: 'standard',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    price: 1999,
    currency: 'NPR',
    billingCycle: 'monthly',
    paymentStatus: 'paid',
    autoRenew: true
  }
];

app.get('/api/subscriptions/plans', (req, res) => {
  console.log('📋 GET /api/subscriptions/plans - Fetching subscription plans');
  
  setTimeout(() => {
    res.json({
      success: true,
      data: mockSubscriptionPlans,
      message: 'Subscription plans fetched successfully'
    });
  }, 500);
});

app.get('/api/subscriptions/current', (req, res) => {
  console.log('👤 GET /api/subscriptions/current - Fetching current user subscription');
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header required'
    });
  }
  
  setTimeout(() => {
    res.json({
      success: true,
      data: mockUserSubscriptions[0],
      message: 'Current subscription fetched successfully'
    });
  }, 300);
});

app.post('/api/subscriptions/subscribe', (req, res) => {
  console.log('💳 POST /api/subscriptions/subscribe - Creating new subscription');
  console.log('Request body:', req.body);
  
  const { plan, billingCycle, paymentMethod } = req.body;
  
  if (!plan || !billingCycle || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: plan, billingCycle, paymentMethod'
    });
  }
  
  const selectedPlan = mockSubscriptionPlans.find(p => p.name.toLowerCase() === plan.toLowerCase());
  if (!selectedPlan) {
    return res.status(404).json({
      success: false,
      message: 'Subscription plan not found'
    });
  }
  
  setTimeout(() => {
    const newSubscription = {
      _id: '507f1f77bcf86cd799439022',
      user: '507f1f77bcf86cd799439001',
      plan: plan.toLowerCase(),
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      price: selectedPlan.price,
      currency: 'NPR',
      billingCycle,
      paymentMethod,
      paymentStatus: 'paid',
      autoRenew: true,
      transactionId: `TXN_${Date.now()}`,
      paymentDate: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: newSubscription,
      message: 'Subscription created successfully'
    });
  }, 1000);
});

app.post('/api/subscriptions/cancel', (req, res) => {
  console.log('❌ POST /api/subscriptions/cancel - Cancelling subscription');
  
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  }, 500);
});

app.get('/api/subscriptions/history', (req, res) => {
  console.log('📊 GET /api/subscriptions/history - Fetching subscription history');
  
  setTimeout(() => {
    res.json({
      success: true,
      data: mockUserSubscriptions,
      message: 'Subscription history fetched successfully'
    });
  }, 400);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Subscription API Mock Server is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/subscriptions/plans',
      'GET /api/subscriptions/current',
      'POST /api/subscriptions/subscribe',
      'POST /api/subscriptions/cancel',
      'GET /api/subscriptions/history'
    ]
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api/subscriptions/plans',
      'GET /api/subscriptions/current',
      'POST /api/subscriptions/subscribe',
      'POST /api/subscriptions/cancel',
      'GET /api/subscriptions/history',
      'GET /health'
    ]
  });
});

app.listen(PORT, () => {
  console.log('🚀 Subscription API Mock Server started!');
  console.log('=====================================');
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('\n📋 Available Endpoints:');
  console.log('  GET    /api/subscriptions/plans     - Get all subscription plans');
  console.log('  GET    /api/subscriptions/current   - Get current user subscription');
  console.log('  POST   /api/subscriptions/subscribe - Create new subscription');
  console.log('  POST   /api/subscriptions/cancel    - Cancel subscription');
  console.log('  GET    /api/subscriptions/history   - Get subscription history');
  console.log('  GET    /health                      - Server health check');
  console.log('\n💡 Usage:');
  console.log('  - Update your frontend API base URL to http://localhost:3001');
  console.log('  - All responses include realistic delays to simulate network latency');
  console.log('  - Press Ctrl+C to stop the server');
  console.log('=====================================');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Subscription API Mock Server...');
  console.log('👋 Goodbye!');
  process.exit(0);
});