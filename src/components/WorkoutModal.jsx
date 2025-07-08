import React, { useState } from 'react';

const WorkoutModal = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const exercises = [
    { name: 'Squat', duration: '3 min' },
    { name: 'Push-Up', duration: '3 min' },
    { name: 'Bent-Over Row', duration: '3 min' },
    { name: 'Lunge', duration: '3 min' },
    { name: 'Plank', duration: '3 min' }
  ];