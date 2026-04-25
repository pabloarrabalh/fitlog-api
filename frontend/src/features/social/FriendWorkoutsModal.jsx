import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export default function FriendWorkoutsModal({ isOpen, onClose, friend, fetchWorkouts }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error } = useToast();

  useEffect(() => {
  if (!isOpen) {
    setWorkouts([]);
    return;
  }

  if (isOpen && friend) {
    const loadWorkouts = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkouts(friend._id || friend.id);
        setWorkouts(data || []);
      } catch (err) {
        error("Failed to load friend's workouts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWorkouts();
  }
}, [isOpen, friend, fetchWorkouts, error]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${friend?.firstName}'s Workouts`} className="max-w-2xl">
      <div className="space-y-4 min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-2xl animate-spin">⏳</span>
          </div>
        ) : workouts.length > 0 ? (
          <div className="grid gap-3">
            {workouts.map((workout, idx) => (
              <div key={workout._id || idx} className="bg-[#1E1E1E] p-4 rounded border border-[#333] flex justify-between items-center">
                <div>
                  <h4 className="text-white font-medium">{workout.name || 'Untitled Workout'}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {workout.date ? new Date(workout.date).toLocaleDateString() : 'No date'}
                  </p>
                </div>
                <span className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded">
                  {workout.exercises?.length || 0} exercises
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p>No public workouts found for this user.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}