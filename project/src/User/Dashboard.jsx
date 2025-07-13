import React, { useState, useEffect } from 'react';
import { TrendingUp, Dumbbell, Calendar, Trophy } from 'lucide-react';

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      id: 1,
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      title: "Track Your Progress",
      description: "Monitor your daily exercise as improvement over time.",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      icon: <Dumbbell className="w-8 h-8 text-blue-500" />,
      title: "Find the Best Workouts",
      description: "Browse a wide range of exercises for every fitness level.",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 3,
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      title: "Customize Your Plan",
      description: "Create personalized workout plans that suit your goals.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: 4,
      icon: <Trophy className="w-8 h-8 text-blue-500" />,
      title: "Join Challenges",
      description: "Stay motivated by participating in our fitness challenges.",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Header */}
      <header className="flex justify-between items-center p-6 relative z-10">
        <div className={`text-2xl font-bold transform transition-all duration-1000 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}>
          FIT ME
        </div>
        <button className={`bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}>
          Log in
        </button>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-12 lg:py-20">
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-8">
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Get Fit.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
                Stay
              </span>
              <br />
              Healthy
            </h1>
          </div>
          
          <div className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Track your workouts, monitor progress,<br />
              and reach your fitness goals with our app.
            </p>
          </div>

          <div className={`transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Content - Hero Image Placeholder */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
          <div className={`relative transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            {/* Animated background elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl animate-ping"></div>
            
            {/* Main hero visual */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl shadow-2xl border border-slate-600/50">
              <div className="w-80 h-96 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto animate-bounce flex items-center justify-center">
                    <Dumbbell className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-300">Your Fitness Journey</p>
                  <p className="text-sm text-gray-400">Starts Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`transform transition-all duration-700 delay-${index + 2}00 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 ${
                hoveredFeature === feature.id ? 'bg-slate-700/50 border-blue-500/50' : ''
              }`}>
                <div className={`mb-4 transform transition-all duration-300 ${
                  hoveredFeature === feature.id ? 'scale-110 rotate-12' : ''
                }`}>
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="px-6 lg:px-12 py-16">
        <div className={`text-center transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { number: "10K+", label: "Active Users", delay: "delay-1200" },
                { number: "500+", label: "Workout Plans", delay: "delay-1400" },
                { number: "98%", label: "Success Rate", delay: "delay-1600" }
              ].map((stat, index) => (
                <div key={index} className={`transform transition-all duration-1000 ${stat.delay} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;