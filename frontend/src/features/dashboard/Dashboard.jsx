import MainLayout from '../../components/layout/MainLayout';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to FitLog - Your Personal Fitness Tracker</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardBody>
              <p className="text-gray-400 text-sm">Total Exercises</p>
              <p className="text-3xl font-bold text-[#CCFF00]">--</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-gray-400 text-sm">Active Routines</p>
              <p className="text-3xl font-bold text-[#CCFF00]">--</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-gray-400 text-sm">Sessions Completed</p>
              <p className="text-3xl font-bold text-[#CCFF00]">--</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-gray-400 text-sm">Friends</p>
              <p className="text-3xl font-bold text-[#CCFF00]">--</p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3 text-gray-300">
              <li>📋 Browse and favorite exercises from our library</li>
              <li>🏋️ Create custom routines with your favorite exercises</li>
              <li>⏱️ Start a workout session and track your performance</li>
              <li>👥 Connect with friends and view their progress</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
