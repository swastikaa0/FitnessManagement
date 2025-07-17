import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const mockNotifications = [
    {
      id: 1,
      type: 'workout',
      title: 'Workout Reminder',
      message: 'Time for your HIIT Cardio Blast workout!',
      timestamp: '2025-07-14T09:30:00',
      read: false,
      priority: 'high',
      icon: '🏃‍♂️'
    },
    {
      id: 2,
      type: 'meal',
      title: 'Meal Plan Updated',
      message: 'Your nutrition plan has been updated with new recipes.',
      timestamp: '2025-07-14T08:15:00',
      read: true,
      priority: 'medium',
      icon: '🍽️'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'Congratulations! You completed 7 days streak.',
      timestamp: '2025-07-13T20:45:00',
      read: false,
      priority: 'high',
      icon: '🏆'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'New features have been added to your fitness app.',
      timestamp: '2025-07-13T16:30:00',
      read: true,
      priority: 'low',
      icon: '⚙️'
    },
    {
      id: 5,
      type: 'social',
      title: 'Friend Request',
      message: 'John Doe wants to connect with you.',
      timestamp: '2025-07-13T14:20:00',
      read: false,
      priority: 'medium',
      icon: '👥'
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Water Reminder',
      message: 'Don\'t forget to drink water! Stay hydrated.',
      timestamp: '2025-07-13T12:00:00',
      read: true,
      priority: 'low',
      icon: '💧'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: false } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-gradient-to-r from-red-50 to-white';
      case 'medium': return 'border-l-amber-500 bg-gradient-to-r from-amber-50 to-white';
      case 'low': return 'border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-white';
      default: return 'border-l-slate-500 bg-gradient-to-r from-slate-50 to-white';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-10 h-10 text-indigo-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-slate-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} new updates` : 'You\'re all caught up!'}
                </p>
              </div>
            </div>
            <button
              onClick={markAllAsRead}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Modern Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 shadow-xl border border-white/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No notifications found</h3>
              <p className="text-slate-600 text-lg">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-l-4 border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  getPriorityColor(notification.priority)
                } ${!notification.read ? 'ring-2 ring-indigo-200' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-5 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-xl">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <p className="text-slate-600 mb-3 leading-relaxed">{notification.message}</p>
                      <div className="flex items-center">
                        <span className="text-slate-500 font-medium">{getTimeAgo(notification.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {notification.read ? (
                      <button
                        onClick={() => markAsUnread(notification.id)}
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-200 hover:scale-110"
                        title="Mark as unread"
                      >
                        <Bell className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all duration-200 hover:scale-110"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-110"
                      title="Delete notification"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
