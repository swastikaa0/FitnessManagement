import React from "react";

export default function PersonalProfile() {
  return (
    <div className="w-full min-h-screen bg-[#fffdf9] flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800">Personal</h1>

        {/* Profile Picture & Info */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Shane"
            className="w-32 h-32 rounded-full object-cover"
          />
          <h2 className="text-2xl font-semibold">Shane</h2>
          <p className="text-gray-600">shane.sine@gmail.com</p>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <FormField label="Full Name" defaultValue="Shane Sine" />
          <FormField label="Gender" defaultValue="Male" />
          <FormField
            label="Date of Birth"
            defaultValue="1991-06-19"
            type="date"
          />

          <div className="pt-4">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-lg">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, defaultValue, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
    </div>
  );
}
