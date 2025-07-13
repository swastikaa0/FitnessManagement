import React, { useState } from 'react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Login Section */}
      <div className="w-1/2 p-16 flex flex-col justify-center bg-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-sm text-gray-600 mb-8">Login to access all your data</p>

        <form>
          <label htmlFor="email" className="text-sm text-gray-600 mb-1 block">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            required
            className="w-full p-3 mb-5 border border-gray-300 rounded-lg text-sm"
          />

          <label htmlFor="password" className="text-sm text-gray-600 mb-1 block">
            Password
          </label>
          <div className="relative mb-5">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              required
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-sm"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-3 text-sm text-gray-500 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-300"
          >
            Create an account
          </button>

          <p className="text-center text-sm mt-6">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div
        className="w-1/2 bg-cover bg-center rounded-l-[80px]"
        style={{ backgroundImage: "url('gym-image.jpg')" }}
      />
    </div>
  );
};

export default LoginPage;
