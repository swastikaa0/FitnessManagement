import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/user/:period', authenticate, async (req, res) => {
  try {
    const { period = 'week' } = req.params;
    const userId = req.user.id;

    const mockAnalytics = {
      achievements: [
        {
          id: 1,
          title: 'First Workout',
          description: 'Completed your first workout session',
          icon: 'Trophy',
          date: '2024-01-15',
          category: 'milestone'
        },
        {
          id: 2,
          title: 'Week Streak',
          description: 'Worked out 5 days this week',
          icon: 'Target',
          date: '2024-01-20',
          category: 'streak'
        }
      ],
      overallStats: {
        totalWorkouts: 45,
        totalCaloriesBurned: 12500,
        averageWorkoutDuration: 42,
        currentStreak: 7
      },
      monthlyReports: [
        {
          month: 'January',
          workouts: 20,
          calories: 5200,
          avgDuration: 38
        },
        {
          month: 'February',
          workouts: 25,
          calories: 7300,
          avgDuration: 45
        }
      ]
    };

    res.json({ data: mockAnalytics });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

router.get('/achievements', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const achievements = [
      {
        id: 1,
        title: 'First Workout',
        description: 'Completed your first workout session',
        icon: 'Trophy',
        date: '2024-01-15',
        category: 'milestone'
      },
      {
        id: 2,
        title: 'Week Streak',
        description: 'Worked out 5 days this week',
        icon: 'Target',
        date: '2024-01-20',
        category: 'streak'
      }
    ];

    res.json({ data: achievements });
  } catch (error) {
    console.error('Achievements fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
});

router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = {
      totalWorkouts: 45,
      totalCaloriesBurned: 12500,
      averageWorkoutDuration: 42,
      currentStreak: 7
    };

    res.json({ data: stats });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

router.get('/reports', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const reports = [
      {
        month: 'January',
        workouts: 20,
        calories: 5200,
        avgDuration: 38
      },
      {
        month: 'February',
        workouts: 25,
        calories: 7300,
        avgDuration: 45
      }
    ];

    res.json({ data: reports });
  } catch (error) {
    console.error('Reports fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
});

export default router;