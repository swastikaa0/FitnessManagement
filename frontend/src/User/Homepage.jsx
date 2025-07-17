import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer'
import apiService from '../services/api';

export default function Homepage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen w-full flex flex-col text-white relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332]/60 to-[#2d4a5c]/60"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex justify-between items-center px-6 py-4">
          <button className="font-bold text-xl px-4 py-2 rounded hover:bg-blue/10 transition">FIT ME</button>
          <div className="flex gap-2">
            <button 
              onClick={handleLogin}
              className="border border-white px-4 py-2 rounded hover:bg-white hover:text-[#1a2332] transition"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/admin/login')}
              className="text-xs text-white/70 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition"
              title="Admin Access"
            >
              Admin
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Get Fit. Stay Healthy</h1>
            <p className="mb-6 text-lg md:text-xl max-w-md">
              Track your workouts, monitor progress, and reach your fitness goals with our app.
            </p>
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 px-6 py-3 rounded text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>
        </main>

        <section className="bg-black/15 backdrop-blur-sm py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <FeatureCard icon="📊" title="Track Your Progress" desc="Monitor your daily exercise as improvement over time." />
            <FeatureCard icon="🏋️" title="Find the Best Workouts" desc="Browse a wide range of exercises for every fitness level." />
            <FeatureCard icon="📋" title="Customize Your Plan" desc="Create personalized workout plans that fit your goals." />
            <FeatureCard icon="🏆" title="Join Challenges" desc="Stay motivated by participating in our fitness challenges." />
          </div>
        </section>

        <PricingSection />

        <section className="py-8 text-center bg-black/20 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold">Why Choose Us</h2>
        </section>

        <Footer />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center hover:scale-105 transition border border-white/20">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm opacity-80">{desc}</p>
    </div>
  );
}

function PricingSection() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await apiService.subscriptions.getPlans();
        const plansData = response?.data?.plans || response?.data || response?.plans || response || [];
        setPlans(Array.isArray(plansData) ? plansData : []);
      } catch (error) {
        console.error('Failed to fetch subscription plans:', error);
        setError('Failed to load subscription plans');
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (planId, planName) => {
    // Navigate to payment page with the selected plan
    navigate(`/payments/${planId || planName.toLowerCase()}`);
  };

  if (loading) {
    return (
      <section className="bg-black/25 backdrop-blur-sm py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading subscription plans...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black/25 backdrop-blur-sm py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-300 text-lg">All plans include the same features - choose your commitment level</p>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300">No subscription plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(plans) && plans.map((plan) => (
            <PricingCard
              key={plan._id || plan.name}
              plan={plan.name}
              price={typeof plan.price === 'number' ? `Rs. ${plan.price}` : plan.price}
              duration={plan.duration}
              features={plan.features || []}
              popular={plan.popular}
              onSelect={() => handleSelectPlan(plan.id || plan._id, plan.name)}
            />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            We accept Esewa, Khalti, ImePay and OnlineBanking
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, price, duration, features, popular, onSelect }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm p-8 rounded-lg border transition-transform hover:scale-105 ${
      popular ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-white/20'
    }`}>
      {popular && (
        <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{plan}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-400">/{duration}</span>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <span className="text-green-400 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <button 
        onClick={onSelect}
        className={`w-full py-3 rounded font-semibold transition ${
          popular 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-white/20 hover:bg-white/30 text-white'
        }`}
      >
        Choose {plan}
      </button>
    </div>
  );
}
