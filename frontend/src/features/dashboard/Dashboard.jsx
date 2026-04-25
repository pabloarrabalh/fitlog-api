import MainLayout from '../../components/layout/MainLayout';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import apiClient from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalExercises: 0,
    activeRoutines: 0,
    sessionsCompleted: 0,
    friends: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const result = await apiClient.get('/users/me/dashboard');
        console.log('Dashboard stats loaded:', result.data.data);
        setStats(result.data.data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
          </h1>
          <p className="text-gray-400">Welcome to FitLog - Your Personal Fitness Tracker</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-[#333] bg-gradient-to-br from-[#1E1E1E] to-[#111]">
            <CardBody>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Exercises</p>
              <p className="text-4xl font-bold text-[#CCFF00]">
                {loading ? '...' : stats.totalExercises}
              </p>
            </CardBody>
          </Card>

          <Card className="border-[#333] bg-gradient-to-br from-[#1E1E1E] to-[#111]">
            <CardBody>
              <p className="text-gray-400 text-sm font-medium mb-1">Active Routines</p>
              <p className="text-4xl font-bold text-[#CCFF00]">
                {loading ? '...' : stats.activeRoutines}
              </p>
            </CardBody>
          </Card>

          <Card className="border-[#333] bg-gradient-to-br from-[#1E1E1E] to-[#111]">
            <CardBody>
              <p className="text-gray-400 text-sm font-medium mb-1">Sessions Completed</p>
              <p className="text-4xl font-bold text-purple-400">
                {loading ? '...' : stats.sessionsCompleted}
              </p>
            </CardBody>
          </Card>

          <Card className="border-[#333] bg-gradient-to-br from-[#1E1E1E] to-[#111]">
            <CardBody>
              <p className="text-gray-400 text-sm font-medium mb-1">Friends</p>
              <p className="text-4xl font-bold text-blue-400">
                {loading ? '...' : stats.friends}
              </p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <span>Browse and create exercises in your personal library</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🏋️</span>
                <span>Design custom routines mixing your favorite exercises</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <span>Start a workout session and track your performance</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <span>Connect with friends and view their progress</span>
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}