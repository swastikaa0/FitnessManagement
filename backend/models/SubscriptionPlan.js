import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'NPR',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'NPR']
  },
  duration: {
    type: String,
    required: true
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'semi-annually', 'annually']
  },
  features: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

subscriptionPlanSchema.index({ isActive: 1 });
subscriptionPlanSchema.index({ displayOrder: 1 });

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);