import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';

export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 });
    
    res.json({
      status: 'success',
      data: {
        plans
      }
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching subscription plans'
    });
  }
};

export const getCurrentSubscription = async (req, res) => {
  try {
    // Get user with subscription data from User model
    const user = await User.findById(req.user._id).select('subscription');
    
    if (!user || !user.subscription || user.subscription.status !== 'active') {
      return res.json({
        status: 'success',
        data: {
          subscription: null,
          message: 'No active subscription found'
        }
      });
    }
    
    // Calculate days remaining
    const calculateDaysRemaining = () => {
      if (!user.subscription.endDate) return 0;
      const today = new Date();
      const endDate = new Date(user.subscription.endDate);
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff > 0 ? daysDiff : 0;
    };
    
    const daysRemaining = calculateDaysRemaining();
    const isExpired = daysRemaining === 0;
    
    const subscriptionData = {
      id: user._id,
      planType: user.subscription.plan,
      status: user.subscription.status,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate,
      paymentStatus: user.subscription.paymentStatus,
      totalSpent: user.subscription.totalSpent,
      remainingDays: daysRemaining,
      isExpired: isExpired,
      isActive: user.subscription.status === 'active' && !isExpired
    };
    
    res.json({
      status: 'success',
      data: {
        subscription: subscriptionData
      }
    });
  } catch (error) {
    console.error('Get current subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching subscription'
    });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const { planType, billingCycle, paymentMethodId } = req.body;
    
    console.log('Create subscription request:', { planType, billingCycle, paymentMethodId });
    
    const subscriptionPlan = await SubscriptionPlan.findOne({ 
      id: planType, 
      isActive: true 
    });
    
    if (!subscriptionPlan) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or inactive subscription plan'
      });
    }
    
    if (billingCycle && billingCycle !== subscriptionPlan.billingCycle) {
      return res.status(400).json({
        status: 'error',
        message: 'Billing cycle does not match the selected plan'
      });
    }
    
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'trialing'] }
    });
    
    if (existingSubscription) {
      return res.status(400).json({
        status: 'error',
        message: 'User already has an active subscription'
      });
    }
    
    const subscription = new Subscription({
      user: req.user._id,
      plan: subscriptionPlan.id,
      description: subscriptionPlan.description || subscriptionPlan.name,
      status: 'pending',
      startDate: new Date(),
      autoRenewal: true,
      price: subscriptionPlan.price,
      currency: subscriptionPlan.currency || 'NPR',
      billingCycle: subscriptionPlan.billingCycle,
      paymentMethod: 'credit-card',
      paymentStatus: 'pending',
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    subscription.setFeatures();
    subscription.calculateNextBillingDate();
    await subscription.save();
    
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.status': 'pending',
      'subscription.plan': subscriptionPlan.id,
      'subscription.startDate': subscription.startDate,
      'subscription.endDate': subscription.endDate,
      'subscription.paymentStatus': 'pending'
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Subscription created successfully',
      data: {
        subscription: {
          id: subscription._id,
          planType: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          price: subscription.price,
          currency: subscription.currency,
          billingCycle: subscription.billingCycle,
          features: subscription.features
        }
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating subscription'
    });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { planType, autoRenewal } = req.body;
    
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'trialing'] }
    });
    
    if (!subscription) {
      return res.status(404).json({
        status: 'error',
        message: 'No active subscription found'
      });
    }
    
    if (planType && planType !== subscription.plan) {
      const subscriptionPlan = await SubscriptionPlan.findOne({ 
        id: planType, 
        isActive: true 
      });
      
      if (!subscriptionPlan) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid or inactive subscription plan'
        });
      }
      
      subscription.plan = planType;
      subscription.price = subscriptionPlan.price;
      subscription.billingCycle = subscriptionPlan.billingCycle;
      await subscription.setFeatures();
      
      await User.findByIdAndUpdate(req.user._id, {
        'subscription.plan': planType
      });
    }
    
    if (autoRenewal !== undefined) {
      subscription.autoRenewal = autoRenewal;
    }
    
    await subscription.save();
    
    res.json({
      status: 'success',
      message: 'Subscription updated successfully',
      data: {
        subscription: {
          id: subscription._id,
          planType: subscription.plan,
          status: subscription.status,
          autoRenewal: subscription.autoRenewal,
          price: subscription.price,
          features: subscription.features
        }
      }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating subscription'
    });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'trialing'] }
    });
    
    if (!subscription) {
      return res.status(404).json({
        status: 'error',
        message: 'No active subscription found'
      });
    }
    
    await subscription.cancelSubscription(reason);
    
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.status': 'cancelled',
      'subscription.plan': 'none'
    });
    
    res.json({
      status: 'success',
      message: 'Subscription cancelled successfully',
      data: {
        subscription: {
          id: subscription._id,
          status: subscription.status,
          cancelledAt: subscription.cancelledAt,
          cancellationReason: subscription.cancellationReason
        }
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while cancelling subscription'
    });
  }
};

export const renewSubscription = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'expired', 'cancelled'] }
    }).sort({ createdAt: -1 });
    
    if (!subscription) {
      return res.status(404).json({
        status: 'error',
        message: 'No subscription found'
      });
    }
    
    await subscription.renewSubscription(paymentMethodId);
    
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.status': 'premium',
      'subscription.plan': subscription.plan,
      'subscription.expiresAt': subscription.endDate
    });
    
    res.json({
      status: 'success',
      message: 'Subscription renewed successfully',
      data: {
        subscription: {
          id: subscription._id,
          planType: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          price: subscription.price
        }
      }
    });
  } catch (error) {
    console.error('Renew subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while renewing subscription'
    });
  }
};

export const getSubscriptionHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [subscriptions, total] = await Promise.all([
      Subscription.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Subscription.countDocuments({ user: req.user._id })
    ]);
    
    const subscriptionHistory = subscriptions.map(sub => ({
      id: sub._id,
      planType: sub.plan,
      status: sub.status,
      startDate: sub.startDate,
      endDate: sub.endDate,
      price: sub.price,
      currency: sub.currency,
      billingCycle: sub.billingCycle,
      createdAt: sub.createdAt,
      cancelledAt: sub.cancelledAt,
      cancellationReason: sub.cancellationReason
    }));
    
    res.json({
      status: 'success',
      data: {
        subscriptions: subscriptionHistory,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: skip + limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get subscription history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching subscription history'
    });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { transactionId, paymentMethodId } = req.body;
    
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'pending'
    }).sort({ createdAt: -1 });
    
    if (!subscription) {
      return res.status(404).json({
        status: 'error',
        message: 'No pending subscription found'
      });
    }
    
    subscription.status = 'active';
    subscription.paymentStatus = 'paid';
    subscription.transactionId = transactionId || subscription.transactionId;
    subscription.paymentMethod = paymentMethodId || subscription.paymentMethod;
    
    await subscription.save();
    
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.status': 'active',
      'subscription.paymentStatus': 'paid'
    });
    
    res.json({
      status: 'success',
      message: 'Payment confirmed and subscription activated',
      data: {
        subscription: {
          id: subscription._id,
          planType: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          paymentStatus: subscription.paymentStatus
        }
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while confirming payment'
    });
  }
};

export const getUsageStats = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'trialing'] }
    });
    
    if (!subscription) {
      return res.status(404).json({
        status: 'error',
        message: 'No active subscription found'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        usage: subscription.usage,
        features: subscription.features,
        planType: subscription.plan,
        remainingDays: subscription.getRemainingDays()
      }
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching usage stats'
    });
  }
};