import React from 'react';
import profileImg from '../assets/downloads.jpeg';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Personal</h2>

        <div className="flex flex-col items-center">
          <img
            src={profileImg}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h3 className="text-xl font-medium">Sabin</h3>
          <p className="text-gray-600 mb-6">Sabinshrestha@gmail.com</p>

          <form className="w-full space-y-4">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                id="fullname"
                defaultValue="Sabin Shrestha"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
              <input
                type="text"
                id="gender"
                defaultValue="Male"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                id="dob"
                defaultValue="1991-06-19"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
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
