
import React, { useState, useEffect } from 'react';
import { useSubscriptionPlans } from '../hooks/useApi';
import apiService from '../services/api';

export default function PlansModal({ isOpen, onClose }) {
  const { data: subscriptionPlans, loading, error } = useSubscriptionPlans();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  const plans = Array.isArray(subscriptionPlans) ? subscriptionPlans : [];

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSubscribe = async (plan) => {
    try {
      setSubscribing(true);
      await apiService.subscriptions.subscribe({
        planType: plan.name?.toLowerCase() || plan.id,
        billingCycle: 'monthly',
        paymentMethodId: 'default'
      });
      console.log(`Subscribed to ${plan.name}`);
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setSubscribing(false);
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price}/mo`;
    }
    return price || 'Contact us';
  };

  const getPaymentDetails = (plan) => {
    return {
      billing: plan.billingCycle || 'Monthly',
      trial: plan.trialPeriod || '7-day free trial',
      description: plan.description || `Perfect for ${plan.name?.toLowerCase()} users.`,
      paymentLink: `/pay/${plan.name?.toLowerCase() || plan.id}`
    };
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-11/12 max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4">
          {selectedPlan ? selectedPlan.name : 'Choose Your Plan'}
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading plans...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">Error loading plans: {error.message}</p>
          </div>
        )}

        {/* Plan List View */}
        {!loading && !error && !selectedPlan && (
          <div className="grid gap-4 md:grid-cols-3">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div
                  key={plan._id || plan.id}
                  className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
                  onClick={() => setSelectedPlan(plan)}
                >
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-lg text-blue-600 mb-2">{formatPrice(plan.price)}</p>
                  <ul className="text-sm mb-2">
                    {(plan.features || []).map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                    Select
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No subscription plans available.</p>
              </div>
            )}
          </div>
        )}

        {/* Plan Detail View */}
        {selectedPlan && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Plans
            </button>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">{selectedPlan.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">{formatPrice(selectedPlan.price)}</p>
              <ul className="text-sm space-y-1 mb-4">
                {(selectedPlan.features || []).map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-700">{getPaymentDetails(selectedPlan).description}</p>
            <p><strong>Billing:</strong> {getPaymentDetails(selectedPlan).billing}</p>
            <p><strong>Trial:</strong> {getPaymentDetails(selectedPlan).trial}</p>
            <button
              onClick={() => handleSubscribe(selectedPlan)}
              disabled={subscribing}
              className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {subscribing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Subscribe Now</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
