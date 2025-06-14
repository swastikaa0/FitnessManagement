import React from "react";

const Hero = () => {
  return (
    <div className="-mt-[600px] flex items-center justify-center min-h-[600px] px-6">
      <div className="text-center max-w-xl z-10 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Get Fit. Stay Healthy</h1>
        <p className="text-lg mb-8 opacity-90">Track your workouts, monitor progress, and reach your fitness goals with our app.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md font-medium text-lg">
          Get Started
        </button>
      </div>
    </div>
    
  );
};

export default Hero;
