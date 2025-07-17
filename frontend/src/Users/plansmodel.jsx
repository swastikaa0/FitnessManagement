
Rabin Joshi
import React, { useState, useEffect } from 'react';

const plans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '$9.99/mo',
    features: ['Access to 10 workouts', 'Community support'],
    paymentDetails: {
      billing: 'Monthly',
      trial: '7-day free trial',
      description: 'Ideal for casual users exploring workouts.',
      paymentLink: '/pay/basic'
    }
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: '$19.99/mo',
    features: ['Access to all workouts', 'Nutrition guides', 'Priority support'],
    paymentDetails: {
      billing: 'Monthly',
      trial: '14-day free trial',
      description: 'Perfect for regular users committed to progress.',
      paymentLink: '/pay/standard'
    }
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '$29.99/mo',
    features: ['All Standard features', '1-on-1 coaching', 'Premium content'],
    paymentDetails: {
      billing: 'Monthly',
      trial: '30-day free trial',
      description: 'For dedicated members seeking personalization.',
      paymentLink: '/pay/premium'
    }
  }
];

export default function PlansModal({ isOpen, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

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

        {/* Plan List View */}
        { !selectedPlan && (
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
                onClick={() => setSelectedPlan(plan)}
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-lg text-blue-600 mb-2">{plan.price}</p>
                <ul className="text-sm mb-2">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                  Select
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Plan Detail View */}
        { selectedPlan && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Plans
            </button>
            <p className="text-gray-700">{selectedPlan.paymentDetails.description}</p>
            <p><strong>Billing:</strong> {selectedPlan.paymentDetails.billing}</p>
            <p><strong>Trial:</strong> {selectedPlan.paymentDetails.trial}</p>
            <a
              href={selectedPlan.paymentDetails.paymentLink}
              className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg"
            >
              Proceed to Pay
            </a>
          </div>
        )}
      </div>
    </div>
  );
}