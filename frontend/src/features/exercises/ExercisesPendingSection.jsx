import ExerciseCard from './ExerciseCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function ExercisePendingSection({
  exercises,
  loading,
  operationLoading,
  onApprove,
  onReject,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-6xl mb-4">🛡️</div>
        <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
        <p className="text-gray-400 text-center max-w-md">
          There are no pending exercises waiting for approval right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise, index) => {
        const exerciseId = exercise._id || exercise.id;
        const isApproving = operationLoading.approve[exerciseId];
        const isRejecting = operationLoading.reject[exerciseId];

        return (
          <div key={exerciseId || `pending-${index}`} className="relative group overflow-hidden rounded-lg">
            {/* Usamos isBrowse=true para ocultar los botones normales de Edit/Delete */}
            <ExerciseCard exercise={exercise} isBrowse={true} />

            {/* Overlay de botones de Admin (Aparecen abajo de la tarjeta) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#0F0F0F] via-[#1E1E1E]/95 to-transparent flex gap-2 pt-12 border-t border-[#333]/50 mt-4">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-500 text-white border-none"
                onClick={() => onApprove(exerciseId)}
                disabled={isApproving || isRejecting}
              >
                {isApproving ? '⏳' : '✅ Approve'}
              </Button>
              <Button
                size="sm"
                variant="danger"
                className="flex-1"
                onClick={() => onReject(exerciseId)}
                disabled={isApproving || isRejecting}
              >
                {isRejecting ? '⏳' : '❌ Reject'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}