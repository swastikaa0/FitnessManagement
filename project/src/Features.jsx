import React from "react";
import FeatureItem from "./FeatureItem";

const features = [
  {
    icon: "chart",
    title: "Track Your Progress",
    description: "Monitor your daily exercise as improvement over time.",
  },
  {
    icon: "dumbbell",
    title: "Find the Best Workouts",
    description: "Browse a wide range of exercises for every fitness level.",
  },
  {
    icon: "calendar",
    title: "Customize Your Plan",
    description: "Create personalized workout plans that suit your goals.",
  },
  {
    icon: "trophy",
    title: "Join Challenges",
    description: "Stay motivated by participating in our fitness challenges.",
  },
];

const Features = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-16">
          {features.map((item, index) => (
            <FeatureItem key={index} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
        <h2 className="text-4xl font-semibold text-center text-gray-900">Why Choose Us</h2>
      </div>
    </section>
  );
};

export default Features;