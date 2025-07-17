import mongoose from 'mongoose';
import SubscriptionPlan from './SubscriptionPlan.js';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'expired', 'cancelled', 'pending'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'NPR']
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'paypal', 'stripe', 'bank-transfer', 'demo_payment', 'other']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  transactionId: String,
  paymentDate: Date,
  nextBillingDate: Date,
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'semi-annually', 'annually'],
    default: 'monthly'
  },
  features: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  usage: {
    workoutsAccessed: {
      type: Number,
      default: 0
    },
    mealsAccessed: {
      type: Number,
      default: 0
    },
    analyticsViewed: {
      type: Number,
      default: 0
    },
    lastAccessed: Date
  },
  discounts: [{
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed-amount']
    },
    value: Number,
    appliedDate: {
      type: Date,
      default: Date.now
    }
  }],
  cancellationReason: String,
  cancellationDate: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: Date,
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

subscriptionSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('plan') || this.isModified('billingCycle')) {
    await this.setFeatures();
    this.calculateNextBillingDate();
  }
  
  if (this.endDate < new Date() && this.status === 'active') {
    this.status = 'expired';
  }
  
  next();
});

subscriptionSchema.methods.setFeatures = async function() {
  try {
    const subscriptionPlan = await SubscriptionPlan.findOne({ id: this.plan });
    this.features = subscriptionPlan?.features || [];
  } catch (error) {
    console.error('Error setting features:', error);
    this.features = [];
  }
};

subscriptionSchema.methods.calculateNextBillingDate = function() {
  if (!this.startDate) return;
  
  const start = new Date(this.startDate);
  let next = new Date(start);
  
  switch (this.billingCycle) {
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'semi-annually':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'annually':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  
  this.nextBillingDate = next;
  this.endDate = next;
};

subscriptionSchema.methods.activate = function() {
  this.status = 'active';
  this.paymentStatus = 'paid';
  this.paymentDate = new Date();
};

subscriptionSchema.methods.cancel = function(reason = '') {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancellationDate = new Date();
  this.autoRenew = false;
};

subscriptionSchema.methods.renew = function() {
  if (this.status === 'expired' || this.status === 'active') {
    const currentEnd = new Date(this.endDate);
    this.startDate = currentEnd;
    this.calculateNextBillingDate();
    this.status = 'active';
    this.paymentStatus = 'paid';
    this.paymentDate = new Date();
  }
};

subscriptionSchema.methods.isExpired = function() {
  return this.endDate < new Date();
};

subscriptionSchema.methods.checkIsActive = function() {
  return this.status === 'active' && !this.isExpired();
};

subscriptionSchema.methods.getDaysRemaining = function() {
  if (this.isExpired()) return 0;
  
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

subscriptionSchema.methods.updateUsage = function(feature) {
  this.usage.lastAccessed = new Date();
  
  switch (feature) {
    case 'workout':
      this.usage.workoutsAccessed += 1;
      break;
    case 'meal':
      this.usage.mealsAccessed += 1;
      break;
    case 'analytics':
      this.usage.analyticsViewed += 1;
      break;
  }
};

subscriptionSchema.statics.getActiveSubscriptions = function() {
  return this.find({
    status: 'active',
    endDate: { $gt: new Date() },
    isActive: true
  });
};

subscriptionSchema.statics.getExpiringSubscriptions = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: 'active',
    endDate: {
      $gte: new Date(),
      $lte: futureDate
    },
    isActive: true
  });
};

subscriptionSchema.index({ user: 1 }, { unique: true });
subscriptionSchema.index({ status: 1, endDate: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });
subscriptionSchema.index({ createdAt: -1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;