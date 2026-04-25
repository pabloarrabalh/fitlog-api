import ExerciseCard from './ExerciseCard';
import { CardSkeleton } from '../../components/ui/Skeleton';

/**
 * My Exercises Section
 * Shows user's exercises with Edit/Delete actions
 */
export default function ExerciseMySection({
  exercises,
  loading,
  operationLoading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-6xl mb-4">🏋️</div>
        <h3 className="text-2xl font-bold text-white mb-2">No Exercises Yet</h3>
        <p className="text-gray-400 text-center max-w-md mb-6">
          Create your first custom exercise to get started. You can add it from here or the
          Browse tab.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise, index) => (
        <div key={exercise._id || exercise.id || `my-exercise-${index}`} className="relative">
          <ExerciseCard
            exercise={exercise}
            onEdit={() => onEdit(exercise)}
            onDelete={() => onDelete(exercise._id || exercise.id)}
            isLoading={operationLoading.delete[exercise._id || exercise.id]}
          />
        </div>
      ))}
    </div>
  );
}
