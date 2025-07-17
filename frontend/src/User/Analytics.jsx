import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import apiService from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  Flame, 
  Scale, 
  Dumbbell,
  BarChart3,
  Filter,
  Download,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  Activity,
  Clock
} from 'lucide-react';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiService.analytics.getAnalytics(selectedPeriod);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data');
      // Fallback to mock data if API fails
      setAnalytics({
        achievements: [
          { title: 'Lost 15 lbs', date: 'This Month', type: 'weight-loss', icon: TrendingDown },
          { title: 'Increased Bench Press by 50 lbs', date: '3 Months', type: 'strength', icon: TrendingUp },
          { title: 'Gained 13 lbs Muscle Mass', date: '3 Months', type: 'muscle-gain', icon: Dumbbell }
        ],
        overallStats: {
          totalWeightChange: -15,
          totalStrengthGain: 37,
          totalCaloriesBurned: 45600
        },
        monthlyReports: [
          {
            month: 'June 2025',
            weightChange: -3.2,
            strengthChange: '+15%',
            caloriesBurned: 8400,
            strengthTrend: 'up',
            weightTrend: 'down'
          },
          {
            month: 'May 2025',
            weightChange: -4.1,
            strengthChange: '+12%',
            caloriesBurned: 7800,
            strengthTrend: 'up',
            weightTrend: 'down'
          },
          {
            month: 'April 2025',
            weightChange: -2.8,
            strengthChange: '+8%',
            caloriesBurned: 7200,
            strengthTrend: 'up',
            weightTrend: 'down'
          },
          {
            month: 'March 2025',
            weightChange: -3.5,
            strengthChange: '+10%',
            caloriesBurned: 6900,
            strengthTrend: 'up',
            weightTrend: 'down'
          },
          {
            month: 'February 2025',
            weightChange: -1.4,
            strengthChange: '+5%',
            caloriesBurned: 6200,
            strengthTrend: 'up',
            weightTrend: 'down'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <XCircle size={64} className="text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg">{error}</p>
              <button 
                onClick={fetchAnalytics}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { achievements, overallStats, monthlyReports } = analytics;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600">Track your fitness progress and achievements</p>
              </div>
              <div className="flex space-x-2">
                {['week', 'month', 'year'].map((period) => (
                  <button 
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                      selectedPeriod === period 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    This {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Scale size={24} />
                  </div>
                  <span className="text-sm opacity-90">Weight Change</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{overallStats.totalWeightChange} lbs</h3>
                <p className="text-sm opacity-90">Net Change</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Dumbbell size={24} />
                  </div>
                  <span className="text-sm opacity-90">Strength Gain</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{overallStats.totalStrengthGain}%</h3>
                <p className="text-sm opacity-90">Average Increase</p>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Flame size={24} />
                  </div>
                  <span className="text-sm opacity-90">Calories</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{overallStats.totalCaloriesBurned.toLocaleString()}</h3>
                <p className="text-sm opacity-90">Total Burned</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      achievement.type === 'weight-loss' ? 'bg-red-100 text-red-600' :
                      achievement.type === 'strength' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <achievement.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">{achievement.title}</h4>
                      <p className="text-sm text-gray-500">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Monthly Reports</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-bold text-gray-800">Month</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-800">Weight Change</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-800">Strength Progress</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-800">Calories Burned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyReports?.map((report, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-gray-800">{report.month}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {report.weightTrend === 'down' ? (
                              <TrendingDown size={16} className="text-red-600" />
                            ) : (
                              <TrendingUp size={16} className="text-green-600" />
                            )}
                            <span className={`font-bold ${
                              report.weightChange < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {report.weightChange} lbs
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp size={16} className="text-green-600" />
                            <span className="font-bold text-green-600">{report.strengthChange}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Flame size={16} className="text-orange-600" />
                            <span className="font-bold text-orange-600">{report.caloriesBurned.toLocaleString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-2xl p-4 text-center">
                  <Scale size={24} className="text-red-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-red-800">Total Weight Lost</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {monthlyReports?.reduce((total, report) => total + Math.abs(report.weightChange), 0) || 0} lbs
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <Dumbbell size={24} className="text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800">Avg Strength Gain</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {monthlyReports?.length ? Math.round(monthlyReports.reduce((total, report) => total + parseInt(report.strengthChange), 0) / monthlyReports.length) : 0}%
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-2xl p-4 text-center">
                  <Flame size={24} className="text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-orange-800">Total Calories</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    {(monthlyReports?.reduce((total, report) => total + report.caloriesBurned, 0) || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

