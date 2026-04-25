import { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ExerciseCard from './ExerciseCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import {
  MUSCLE_GROUPS,
  EQUIPMENT_OPTIONS,
  MOVEMENT_PATTERNS,
  DIFFICULTY_OPTIONS,
} from '../../validators/exerciseSchemas';

/**
 * Browse Exercises Section
 * Shows public library with search & filters
 */
export default function ExerciseBrowseSection({
  exercises,
  loading,
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.q ||
    filters.muscle ||
    filters.equipment ||
    filters.movementPattern ||
    filters.difficulty;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Search exercises..."
            disabled
            className="opacity-50"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="🔍 Search exercises by name or muscle..."
          value={filters.q}
          onChange={(e) => onFilterChange('q', e.target.value)}
          className="flex-1"
        />
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="whitespace-nowrap"
        >
          {showFilters ? '✕ Filters' : '⚙️ Filters'}
        </Button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-[#1E1E1E] border border-[#333] rounded-lg p-4 space-y-4">
          {/* Filter by Muscle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Primary Muscle
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <button
                onClick={() => onFilterChange('muscle', '')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                  !filters.muscle
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-[#0F0F0F] text-gray-300 border border-[#333] hover:bg-[#2E2E2E]'
                }`}
              >
                All
              </button>
              {MUSCLE_GROUPS.map((muscle) => (
                <button
                  key={muscle.value}
                  onClick={() => onFilterChange('muscle', muscle.value)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    filters.muscle === muscle.value
                      ? 'bg-[#CCFF00] text-black'
                      : 'bg-[#0F0F0F] text-gray-300 border border-[#333] hover:bg-[#2E2E2E]'
                  }`}
                >
                  {muscle.emoji} {muscle.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Equipment
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <button
                onClick={() => onFilterChange('equipment', '')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                  !filters.equipment
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-[#0F0F0F] text-gray-300 border border-[#333] hover:bg-[#2E2E2E]'
                }`}
              >
                All
              </button>
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <button
                  key={equipment.value}
                  onClick={() => onFilterChange('equipment', equipment.value)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    filters.equipment === equipment.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#0F0F0F] text-gray-300 border border-[#333] hover:bg-[#2E2E2E]'
                  }`}
                >
                  {equipment.icon} {equipment.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Movement Pattern */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Movement Pattern
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <button
                onClick={() => onFilterChange('movementPattern', '')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                  !filters.movementPattern
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-[#0F0F0F] text-gray-300 border border-[#333] hover:bg-[#2E2E2E]'
                }`}
              >
                All
              </button>
              {MOVEMENT_PATTERNS.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => onFilterChange('movementPattern', pattern.value)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    filters.movementPattern === pattern.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#0F0F0F] text-gray-300 border border-[#333] hover:bg-[#2E2E2E]'
                  }`}
                >
                  {pattern.emoji} {pattern.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => onFilterChange('difficulty', '')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                  !filters.difficulty
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-[#0F0F0F] text-gray-300 border border-[#333] hover:bg-[#2E2E2E]'
                }`}
              >
                All
              </button>
              {DIFFICULTY_OPTIONS.map((difficulty) => (
                <button
                  key={difficulty.value}
                  onClick={() => onFilterChange('difficulty', difficulty.value)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    filters.difficulty === difficulty.value
                      ? 'bg-green-600 text-white'
                      : 'bg-[#0F0F0F] text-gray-300 border border-[#333] hover:bg-[#2E2E2E]'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClearFilters} className="flex-1">
                🗑️ Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Exercise Grid */}
      {exercises && exercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise._id || exercise.id || `exercise-${index}`}
              exercise={exercise}
              isBrowse={true}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Exercises Found</h3>
          <p className="text-gray-400 text-center max-w-md">
            {hasActiveFilters
              ? 'Try adjusting your search filters to find exercises.'
              : 'No public exercises available yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
