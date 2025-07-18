import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

let suggestions = [
  {
    id: 1,
    user: 'Sarah Johnson',
    userId: '507f1f77bcf86cd799439011',
    avatar: 'SJ',
    category: 'nutrition',
    title: 'Pre-workout nutrition timing',
    content: 'I found that eating a banana with peanut butter 30 minutes before workouts gives me sustained energy without feeling heavy. Game changer for my morning sessions!',
    likes: 24,
    likedBy: [],
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    user: 'Mike Chen',
    userId: '507f1f77bcf86cd799439012',
    avatar: 'MC',
    category: 'training',
    title: 'Progressive overload strategy',
    content: 'Instead of always adding weight, try increasing reps or sets first. I went from 8 reps to 12 reps before adding weight, and my form improved dramatically.',
    likes: 31,
    likedBy: [],
    createdAt: new Date('2024-01-16')
  },
  {
    id: 3,
    user: 'Dr. Alex Rodriguez',
    userId: '507f1f77bcf86cd799439013',
    avatar: 'AR',
    category: 'recovery',
    title: 'Sleep optimization for athletes',
    content: 'Keep your bedroom temperature between 65-68°F (18-20°C) for optimal sleep quality. Also, avoid screens 1 hour before bed - your recovery will thank you.',
    likes: 45,
    likedBy: [],
    createdAt: new Date('2024-01-17')
  },
  {
    id: 4,
    user: 'Emma Wilson',
    userId: '507f1f77bcf86cd799439014',
    avatar: 'EW',
    category: 'lifestyle',
    title: 'Meal prep efficiency hack',
    content: 'Cook proteins in bulk on Sunday, but prep vegetables fresh every 2-3 days. This keeps meals interesting while saving time. Been doing this for 6 months!',
    likes: 18,
    likedBy: [],
    createdAt: new Date('2024-01-18')
  },
  {
    id: 5,
    user: 'Coach Lisa Park',
    userId: '507f1f77bcf86cd799439015',
    avatar: 'LP',
    category: 'training',
    title: 'Form over weight always',
    content: 'Dropped my squat weight by 20% to focus on form. Three months later, I\'m squatting more than ever with zero knee pain. Ego lifting isn\'t worth injuries.',
    likes: 67,
    likedBy: [],
    createdAt: new Date('2024-01-19')
  },
  {
    id: 6,
    user: 'Tom Anderson',
    userId: '507f1f77bcf86cd799439016',
    avatar: 'TA',
    category: 'nutrition',
    title: 'Hydration tracking method',
    content: 'Use a large water bottle with time markers. Helped me go from 4 glasses to 10 glasses daily. Energy levels and skin improved noticeably.',
    likes: 29,
    likedBy: [],
    createdAt: new Date('2024-01-20')
  }
];

let nextId = 7;

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredSuggestions = suggestions;
    if (category && category !== 'all') {
      filteredSuggestions = suggestions.filter(s => s.category === category);
    }
    
    res.json(filteredSuggestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    console.error('Suggestions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch suggestions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const suggestion = suggestions.find(s => s.id === parseInt(req.params.id));
    
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    res.json(suggestion);
  } catch (error) {
    console.error('Suggestion fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch suggestion' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { category, title, content } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || 'Anonymous User';
    
    if (!category || !title || !content) {
      return res.status(400).json({ message: 'Category, title, and content are required' });
    }
    
    const newSuggestion = {
      id: nextId++,
      user: userName,
      userId: userId,
      avatar: userName.split(' ').map(n => n[0]).join('').toUpperCase(),
      category,
      title,
      content,
      likes: 0,
      likedBy: [],
      createdAt: new Date()
    };
    
    suggestions.push(newSuggestion);
    res.status(201).json(newSuggestion);
  } catch (error) {
    console.error('Suggestion creation error:', error);
    res.status(500).json({ message: 'Failed to create suggestion' });
  }
});

router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const suggestionId = parseInt(req.params.id);
    const userId = req.user.id;
    
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    const isLiked = suggestion.likedBy.includes(userId);
    
    if (isLiked) {
      suggestion.likedBy = suggestion.likedBy.filter(id => id !== userId);
      suggestion.likes = Math.max(0, suggestion.likes - 1);
    } else {
      suggestion.likedBy.push(userId);
      suggestion.likes += 1;
    }
    
    res.json({ 
      liked: !isLiked, 
      likes: suggestion.likes,
      message: isLiked ? 'Suggestion unliked' : 'Suggestion liked'
    });
  } catch (error) {
    console.error('Like toggle error:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
});

router.delete('/:id/like', authenticate, async (req, res) => {
  try {
    const suggestionId = parseInt(req.params.id);
    const userId = req.user.id;
    
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    suggestion.likedBy = suggestion.likedBy.filter(id => id !== userId);
    suggestion.likes = Math.max(0, suggestion.likes - 1);
    
    res.json({ 
      liked: false, 
      likes: suggestion.likes,
      message: 'Suggestion unliked'
    });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ message: 'Failed to unlike suggestion' });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const filteredSuggestions = suggestions.filter(s => s.category === category);
    
    res.json(filteredSuggestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    console.error('Category suggestions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch category suggestions' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const suggestionId = parseInt(req.params.id);
    const { category, title, content } = req.body;
    const userId = req.user.id;
    
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    if (suggestion.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this suggestion' });
    }
    
    if (category) suggestion.category = category;
    if (title) suggestion.title = title;
    if (content) suggestion.content = content;
    suggestion.updatedAt = new Date();
    
    res.json(suggestion);
  } catch (error) {
    console.error('Suggestion update error:', error);
    res.status(500).json({ message: 'Failed to update suggestion' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const suggestionId = parseInt(req.params.id);
    const userId = req.user.id;
    
    const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId);
    if (suggestionIndex === -1) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    const suggestion = suggestions[suggestionIndex];
    if (suggestion.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this suggestion' });
    }
    
    suggestions.splice(suggestionIndex, 1);
    res.json({ message: 'Suggestion deleted successfully' });
  } catch (error) {
    console.error('Suggestion deletion error:', error);
    res.status(500).json({ message: 'Failed to delete suggestion' });
  }
});

export default router;