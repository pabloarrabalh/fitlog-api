import Card, { CardBody, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { MUSCLE_GROUPS, EQUIPMENT_OPTIONS, MOVEMENT_PATTERNS } from '../../validators/exerciseSchemas';

/**
 * Beautiful Exercise Card Component
 * Shows exercise info with visual hierarchy and actions
 */
export default function ExerciseCard({
  exercise,
  onEdit,
  onDelete,
  isLoading = false,
  isBrowse = false,
}) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-900/30 text-green-300 border-green-700';
      case 'moderate':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'hard':
        return 'bg-red-900/30 text-red-300 border-red-700';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  const getMuscleEmoji = (muscle) => {
    const found = MUSCLE_GROUPS.find((m) => m.value === muscle);
    return found?.emoji || '💪';
  };

  const getEquipmentIcon = (equipment) => {
    const found = EQUIPMENT_OPTIONS.find((e) => e.value === equipment);
    return found?.icon || '⚙️';
  };

  const getPatternEmoji = (pattern) => {
    const found = MOVEMENT_PATTERNS.find((p) => p.value === pattern);
    return found?.emoji || '❓';
  };

  return (
    <Card className="hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-all duration-200 overflow-hidden">
      {/* Header Section - Name & Primary Info */}
      <CardBody className="pb-3 border-b border-[#333]">
        {/* Exercise Name */}
        <h3 className="text-lg font-bold text-white mb-2 truncate hover:text-[#CCFF00] transition-colors">
          {exercise.name}
        </h3>

        {/* Description */}
        {exercise.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2 hover:line-clamp-none">
            {exercise.description}
          </p>
        )}

        {/* Primary Muscles */}
        <div className="flex flex-wrap gap-2 mb-3">
          {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 ? (
            exercise.primaryMuscles.map((muscle, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#CCFF00]/10 text-[#CCFF00] rounded text-xs font-medium border border-[#CCFF00]/30"
              >
                {getMuscleEmoji(muscle)}
                {muscle}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No muscles specified</span>
          )}
        </div>

        {/* Secondary Muscles (if any) */}
        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {exercise.secondaryMuscles.map((muscle, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/20 text-purple-300 rounded text-xs font-medium border border-purple-700/30"
              >
                {getMuscleEmoji(muscle)}
                <span className="text-purple-400">(secondary)</span>
              </span>
            ))}
          </div>
        )}
      </CardBody>

      {/* Details Section - Equipment, Pattern, Difficulty */}
      <CardBody className="py-3 space-y-3 border-b border-[#333]">
        <div className="grid grid-cols-3 gap-2 text-xs">
          {/* Equipment */}
          <div className="flex items-center gap-2 bg-blue-900/20 px-2 py-2 rounded border border-blue-700/30">
            <span className="text-lg">{getEquipmentIcon(exercise.equipment)}</span>
            <span className="text-blue-300 font-medium truncate">
              {exercise.equipment}
            </span>
          </div>

          {/* Movement Pattern */}
          <div className="flex items-center gap-2 bg-indigo-900/20 px-2 py-2 rounded border border-indigo-700/30">
            <span className="text-lg">{getPatternEmoji(exercise.movementPattern)}</span>
            <span className="text-indigo-300 font-medium truncate">
              {exercise.movementPattern}
            </span>
          </div>

          {/* Difficulty */}
          <div
            className={`flex items-center gap-2 px-2 py-2 rounded border ${getDifficultyColor(
              exercise.difficulty
            )}`}
          >
            <span className="font-bold text-sm">●</span>
            <span className="font-medium truncate">{exercise.difficulty}</span>
          </div>
        </div>
      </CardBody>

      {/* Footer - Actions */}
      {!isBrowse && (
        <CardFooter className="pt-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={onEdit}
            disabled={isLoading}
          >
            {isLoading ? '⏳' : '✏️'} Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="flex-1"
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? '⏳' : '🗑️'} Delete
          </Button>
        </CardFooter>
      )}

      {/* Visibility Badge (top-right corner) */}
      <div className="absolute top-2 right-2">
        <Badge
          variant={exercise.visibility === 'public' ? 'primary' : 'default'}
          className="text-xs"
        >
          {exercise.visibility === 'public' ? '🌍 Public' : '🔒 Private'}
        </Badge>
      </div>
    </Card>
  );
}
