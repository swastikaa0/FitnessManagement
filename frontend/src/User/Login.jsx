// import React, { useState } from 'react';

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="flex h-screen w-full">
//       {/* Login Section */}
//       <div className="w-1/2 p-16 flex flex-col justify-center bg-white">
//         <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
//         <p className="text-sm text-gray-600 mb-8">Login to access all your data</p>

//         <form>
//           <label htmlFor="email" className="text-sm text-gray-600 mb-1 block">
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="email"
//             placeholder="Enter your email address"
//             required
//             className="w-full p-3 mb-5 border border-gray-300 rounded-lg text-sm"
//           />

//           <label htmlFor="password" className="text-sm text-gray-600 mb-1 block">
//             Password
//           </label>
//           <div className="relative mb-5">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               placeholder="Enter your password"
//               required
//               className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-sm"
//             />
//             <button
//               type="button"
//               onClick={togglePassword}
//               className="absolute right-3 top-3 text-sm text-gray-500 focus:outline-none"
//             >
//               {showPassword ? 'Hide' : 'Show'}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-300"
//           >
//             Create an account
//           </button>

//           <p className="text-center text-sm mt-6">
//             Don&apos;t have an account?{' '}
//             <a href="#" className="text-blue-600 font-semibold hover:underline">
//               Register
//             </a>
//           </p>
//         </form>
//       </div>

//       {/* Image Section */}
//       <div
//         className="w-1/2 bg-cover bg-center rounded-l-[80px]"
//         style={{ backgroundImage: "url('gym-image.jpg')" }}
//       />
//     </div>
//   );
// };

// export default LoginPage;

import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h2>
          <p className="text-sm text-gray-600 mb-6">Login to access all your data</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-700 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>

        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="/images/Login.jpg"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}