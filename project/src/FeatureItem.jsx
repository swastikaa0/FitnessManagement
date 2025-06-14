import React from "react";
import {
  FaChartLine,
  FaDumbbell,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";

const iconMap = {
  chart: <FaChartLine className="text-blue-600 text-xl" />,
  dumbbell: <FaDumbbell className="text-blue-600 text-xl" />,
  calendar: <FaCalendarAlt className="text-blue-600 text-xl" />,
  trophy: <FaTrophy className="text-blue-600 text-xl" />,
};

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-blue-100 p-3 rounded-lg">
        {iconMap[icon]}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1 text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureItem;