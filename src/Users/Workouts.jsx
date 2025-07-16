import React from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';

export default function Workouts() {
  const workoutCategories = [
    { 
      name: 'Morning Yoga', 
      duration: '50 min',
      image: '🧘‍♀️',
      color: 'bg-purple-50', 
      textColor: 'text-purple-600',
      type: 'Mindfulness'
    },
    { 
      name: 'Full Body Stretch', 
      duration: '50 min',
      image: '🤸‍♀️',
      color: 'bg-pink-50', 
      textColor: 'text-pink-600',
      type: 'Flexibility'
    },
    { 
      name: 'HIIT', 
      duration: '20 min',
      image: '🏃‍♀️',
      color: 'bg-orange-50', 
      textColor: 'text-orange-600',
      type: 'Cardio'
    },
    { 
      name: 'Dumbbell Workout', 
      duration: '45 min',
      image: '🏋️‍♂️',
      color: 'bg-blue-50', 
      textColor: 'text-blue-600',
      type: 'Strength'
    },
    { 
      name: 'Cardio Blast', 
      duration: '30 min',
      image: '💪',
      color: 'bg-green-50', 
      textColor: 'text-green-600',
      type: 'Cardio'
    },
    { 
      name: 'Cardio Blast', 
      duration: '20 min',
      image: '🤾‍♀️',
      color: 'bg-yellow-50', 
      textColor: 'text-yellow-600',
      type: 'HIIT'
    },
    { 
      name: 'Lower Body Workout', 
      duration: '35 min',
      image: '🦵',
      color: 'bg-indigo-50', 
      textColor: 'text-indigo-600',
      type: 'Strength'
    },
    { 
      name: 'Meditation', 
      duration: '15 min',
      image: '🧘‍♂️',
      color: 'bg-teal-50', 
      textColor: 'text-teal-600',
      type: 'Mindfulness'
    }
  ];

  const handleWorkoutClick = (workout) => {
    console.log(`Viewing ${workout.name} workout details`);
    // Add your navigation or workout details logic here
    // Example: navigate(`/workout/${workout.name.toLowerCase().replace(' ', '-')}`);
  };

  const handleAddWorkout = (workout) => {
    console.log(`Adding ${workout.name} to your workout plan`);
    // Add logic to add workout to user's plan
    // You can show a success message or navigate to another page
  };