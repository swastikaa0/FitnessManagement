import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle, AlertTriangle, Crown, Zap } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { useAuth } from '../contexts/AuthContext';
import { useSubscriptionPlans, useCurrentSubscription } from '../hooks/useApi';
import apiService from '../services/api';

export default function UserSubscription() {
  const { user, refreshUser } = useAuth();
  const { planId } = useParams();
  const navigate = useNavigate();
  const { data: subscriptionPlansData, loading: plansLoading } = useSubscriptionPlans();
  const { data: currentSubscription, loading: subscriptionLoading, refetch } = useCurrentSubscription();
  
  const subscriptionPlans = subscriptionPlansData?.data?.plans || subscriptionPlansData?.plans || [];
  
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getPlanIcon = (planName) => {
    switch (planName?.toLowerCase()) {
      case 'basic':
        return <Zap className="w-6 h-6" />;
      case 'standard':
        return <Crown className="w-6 h-6" />;
      case 'premium':
        return <Crown className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName?.toLowerCase()) {
      case 'basic':
        return 'bg-blue-500';
      case 'standard':
        return 'bg-purple-500';
      case 'premium':
        return 'bg-gold-500';
      default:
        return 'bg-blue-500';
    }
  };

  const plans = Array.isArray(subscriptionPlans) ? subscriptionPlans.map(plan => ({
    ...plan,
    icon: getPlanIcon(plan.name),
    color: getPlanColor(plan.name)
  })) : [];

  console.log('Subscription Plans Data:', subscriptionPlans);
  console.log('Processed Plans:', plans);
  console.log('Plans Loading:', plansLoading);

  const daysRemaining =  30
  const isExpiringSoon = daysRemaining <= 7;
  const isExpired = daysRemaining === 0;
  const hasActiveSubscription = currentSubscription?.subscription?.status === 'active';
  console.log(hasActiveSubscription)



  // Handle URL plan selection
  useEffect(() => {
    if (planId && plans.length > 0 && !showRenewalModal) {
      const plan = plans.find(p => p.id === planId || p.name?.toLowerCase() === planId.toLowerCase());
      if (plan) {
        setSelectedPlan(plan);
        setShowRenewalModal(true);
      } else {
        setError(`Plan "${planId}" not found`);
        // Navigate back to payments without plan parameter
        navigate('/payments', { replace: true });
      }
    }
  }, [planId, plans, showRenewalModal, navigate]);

  const handleRenewSubscription = (plan) => {
    setSelectedPlan(plan);
    setShowRenewalModal(true);
  };

  const handleConfirmRenewal = async () => {
    // This function is now handled by the demo payment system in RenewalModal
    // The actual payment processing happens in handleDemoPayment within RenewalModal
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiService.subscriptions.cancel();
      setSuccess('Subscription cancelled successfully');
      refetch();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      setError(error.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (isExpired) return 'bg-red-100 text-red-800';
    if (isExpiringSoon) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = () => {
    if (isExpired) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (isExpiringSoon) return <Clock className="w-5 h-5 text-yellow-600" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  // Demo Payment Modal Component
  const RenewalModal = () => {
    const [paymentData, setPaymentData] = useState({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
    const [paymentStep, setPaymentStep] = useState('details'); // 'details' or 'processing' or 'success'

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      let formattedValue = value;

      // Format card number with spaces
      if (name === 'cardNumber') {
        formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
      }
      
      // Format expiry date
      if (name === 'expiryDate') {
        formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/').slice(0, 5);
      }
      
      // Format CVV
      if (name === 'cvv') {
        formattedValue = value.replace(/\D/g, '').slice(0, 3);
      }

      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleDemoPayment = async () => {
      // Validate form
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
        setError('Please fill in all payment details');
        return;
      }

      setPaymentStep('processing');
      setError('');
      
      // Simulate payment processing
      setTimeout(async () => {
        try {
          // Call the actual subscription API
          if (hasActiveSubscription) {
            await apiService.subscriptions.updateSubscription({
              planType: selectedPlan.id,
              billingCycle: selectedPlan.billingCycle
            });
            setSuccess('Subscription updated successfully!');
          } else {
            // Create subscription first
            const subscriptionResponse = await apiService.subscriptions.subscribe({
              planType: selectedPlan.id,
              billingCycle: selectedPlan.billingCycle,
              paymentMethodId: 'demo_payment'
            });
            
            // Confirm payment to activate subscription
            await apiService.subscriptions.confirmPayment({
              transactionId: `demo_txn_${Date.now()}`,
              paymentMethodId: 'demo_payment'
            });
            
            setSuccess('Payment successful! Welcome to premium!');
          }
          
          setPaymentStep('success');
          
          // Refresh data to show updated subscription status
          await refetch();
          await refreshUser();
          
          // Close modal and redirect after 3 seconds
          setTimeout(() => {
            setShowRenewalModal(false);
            setSelectedPlan(null);
            setPaymentStep('details');
            setPaymentData({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
            
            // Always navigate to payments page to refresh the view
            navigate('/payments', { replace: true });
            
            // Force page refresh to ensure all data is updated
            window.location.reload();
          }, 3000);
          
        } catch (error) {
          console.error('Subscription error:', error);
          setError(error.message || 'Payment failed. Please try again.');
          setPaymentStep('details');
        }
      }, 2000);
    };

    return (
      <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
          {paymentStep === 'details' && (
            <>
              <div className="text-center mb-6">
                <div className={`w-16 h-16 ${selectedPlan?.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                  {selectedPlan?.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to {selectedPlan?.name}</h2>
                <p className="text-gray-600">Enter your payment details</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{selectedPlan?.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price</span>
                  <span className="font-bold text-lg">${selectedPlan?.price}</span>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRenewalModal(false);
                    setSelectedPlan(null);
                    // Navigate back to payments without plan parameter if we came from URL
                    if (planId) {
                      navigate('/payments', { replace: true });
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDemoPayment}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ${selectedPlan?.price}</span>
                </button>
              </div>
            </>
          )}

          {paymentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h3>
              <p className="text-gray-600">Please wait while we process your payment</p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Welcome to {selectedPlan?.name} plan</p>
              <div className="text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mx-auto mb-2"></div>
                Redirecting to your subscription page...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (subscriptionLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Subscription</h1>
              <p className="text-gray-600">Manage your fitness plan and renewals</p>
            </div>

            {/* Success/Error Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-600">
                {success}
              </div>
            )}

            {/* Subscription Status Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Subscription Status</h2>
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor()} flex items-center space-x-2`}>
                    {getStatusIcon()}
                    <span>
                      {!hasActiveSubscription ? 'No Active Plan' : isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                    </span>
                  </span>
                  {hasActiveSubscription && (
                    <button
                      onClick={handleCancelSubscription}
                      className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {hasActiveSubscription ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className={`font-bold text-lg ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-blue-600'}`}>
                      {daysRemaining}
                    </div>
                    <div className="text-sm text-gray-600">Days Remaining</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-bold text-green-600 text-lg">
                      {currentSubscription?.data?.subscription?.endDate ? new Date(currentSubscription.data.subscription.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Expires On</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-600 mb-4">Choose a plan below to get started with premium features</p>
                </div>
              )}
            </div>

            {/* Renewal Options */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Renewal Options</h2>
              
              {plansLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscription Plans Available</h3>
                  <p className="text-gray-600 mb-4">Please contact support or try again later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => {
                  const isCurrentPlan = currentSubscription?.data?.subscription?.planType === plan.id;
                  return (
                    <div key={plan.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative">
                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Current Plan
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <div className={`w-12 h-12 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white`}>
                          {plan.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                        <div className="text-2xl font-bold text-gray-900 mt-2">
                          ${plan.price}
                          <span className="text-sm font-normal text-gray-600">/{plan.duration}</span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleRenewSubscription(plan)}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          isCurrentPlan
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {hasActiveSubscription ? (isCurrentPlan ? 'Renew Plan' : 'Switch Plan') : 'Subscribe'}
                      </button>
                    </div>
                  );
                })}
              </div>
              )}
            </div>

            {/* Subscription History */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{user?.fullName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Billing Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Plan:</span>
                      <span className="font-medium">
                        {currentSubscription?.data?.subscription?.planType || 'No active plan'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">
                        {currentSubscription?.data?.subscription?.status || 'inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">
                        {currentSubscription?.data?.subscription?.price ? `$${currentSubscription.data.subscription.price}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Renewal Modal */}
      {showRenewalModal && <RenewalModal />}
    </div>
  );
}
