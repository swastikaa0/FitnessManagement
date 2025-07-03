import React from 'react';
import profileImg from '../assets/downloads.jpeg';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-center mb-8">Personal Profile</h2>

        <div className="flex flex-row items-start gap-10">
          {/* Profile Image and Info */}
          <div className="flex flex-col items-center w-1/3">
            <img
              src={profileImg}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">Sabin</h3>
            <p className="text-gray-600">Sabinshrestha@gmail.com</p>
          </div>

          {/* Profile Form */}
          <form className="flex-1 space-y-6">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                id="fullname"
                defaultValue="Sabin Shrestha"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
              <input
                type="text"
                id="gender"
                defaultValue="Male"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                id="dob"
                defaultValue="1991-06-19"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
