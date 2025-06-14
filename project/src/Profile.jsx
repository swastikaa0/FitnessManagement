import React from "react";
import {
  Clock,
  Flame,
  CheckCircle,
  User,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="w-full min-h-screen bg-[#fffdf9] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">Shane</h1>
            <p className="text-gray-600">shane.sine@gmail.com</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Clock />} value="2 h 30 m" label="Total time" />
        <StatCard icon={<Flame className="text-orange-500" />} value="7200 cal" label="Burned" />
        <StatCard icon={<CheckCircle className="text-yellow-500" />} value="2" label="Done" />
      </div>

      {/* Menu */}
      <div className="space-y-2">
        <MenuItem icon={<User />} label="Personal" />
        <MenuItem icon={<Settings />} label="General" />
        <MenuItem icon={<Bell />} label="Notifications" />
        <MenuItem icon={<HelpCircle />} label="Help" />
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <div className="text-gray-500 mb-2 flex justify-center">{icon}</div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}

function MenuItem({ icon, label }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="text-gray-700">{icon}</div>
        <span className="text-gray-800 font-medium">{label}</span>
      </div>
      <span className="text-gray-400 text-xl">&gt;</span>
    </div>
  );
}
