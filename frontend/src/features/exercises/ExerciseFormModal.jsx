import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import {
  validateExercise,
  MUSCLE_GROUPS,
  EQUIPMENT_OPTIONS,
  MOVEMENT_PATTERNS,
  DIFFICULTY_OPTIONS,
} from '../../validators/exerciseSchemas';

/**
 * Robust Exercise Form Modal
 * Handles: Create & Edit with full validation & error display
 */
export default function ExerciseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: 'other',
    movementPattern: 'other',
    difficulty: 'moderate',
    visibility: 'public',
    substitutes: [],
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { error: errorToast } = useToast();

  // Initialize form with existing data (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        primaryMuscles: initialData.primaryMuscles || [],
        secondaryMuscles: initialData.secondaryMuscles || [],
        equipment: initialData.equipment || 'other',
        movementPattern: initialData.movementPattern || 'other',
        difficulty: initialData.difficulty || 'moderate',
        visibility: initialData.visibility || 'public',
        substitutes: initialData.substitutes || [],
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Clear error when user corrects field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMuscleSelect = (muscle, isPrimary = true) => {
    const key = isPrimary ? 'primaryMuscles' : 'secondaryMuscles';
    setFormData((prev) => {
      const current = prev[key];
      const updated = current.includes(muscle)
        ? current.filter((m) => m !== muscle)
        : [...current, muscle];
      return { ...prev, [key]: updated };
    });
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('📋 handleSubmit called:', {
      isEditing: !!initialData,
      initialDataId: initialData?.id,
      initialDataName: initialData?.name,
      formDataName: formData.name,
    });

    // Validate
    const validation = validateExercise(formData, !!initialData);
    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors || {});
      errorToast('Please fix the errors in the form');
      return;
    }

    try {
      // Pass both ID (if editing) and data
      console.log('📤 Submitting data:', {
        exerciseId: initialData?.id,
        data: validation.data,
      });

      await onSubmit({
        exerciseId: initialData?.id,
        data: validation.data,
      });

      // Reset on success
      setFormData({
        name: '',
        description: '',
        primaryMuscles: [],
        secondaryMuscles: [],
        equipment: 'other',
        movementPattern: 'other',
        difficulty: 'moderate',
        visibility: 'public',
        substitutes: [],
      });
      setFieldErrors({});
      setTouched({});
      onClose();
    } catch (err) {
      console.error('❌ Form submission error:', err);
      // Error already shown by useMyExercises hook
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? '✏️ Edit Exercise' : '➕ Create New Exercise'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Exercise Name *
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Bench Press"
            error={touched.name && fieldErrors.name}
          />
          {touched.name && fieldErrors.name && (
            <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the exercise..."
            rows="3"
            maxLength={1000}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#333] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#CCFF00] resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000
          </p>
        </div>

        {/* Primary Muscles */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primary Muscle(s) * {formData.primaryMuscles.length > 0 && `(${formData.primaryMuscles.length})`}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {MUSCLE_GROUPS.map((muscle) => (
              <button
                key={muscle.value}
                type="button"
                onClick={() => handleMuscleSelect(muscle.value, true)}
                className={`px-3 py-2 rounded font-medium text-sm transition-all ${
                  formData.primaryMuscles.includes(muscle.value)
                    ? 'bg-[#CCFF00] text-black ring-2 ring-[#CCFF00]'
                    : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2E2E2E] border border-[#333]'
                }`}
              >
                {muscle.emoji} {muscle.label}
              </button>
            ))}
          </div>
          {touched.primaryMuscles && fieldErrors.primaryMuscles && (
            <p className="text-xs text-red-400 mt-1">{fieldErrors.primaryMuscles}</p>
          )}
        </div>

        {/* Secondary Muscles */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Secondary Muscle(s) {formData.secondaryMuscles.length > 0 && `(${formData.secondaryMuscles.length})`}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {MUSCLE_GROUPS.map((muscle) => (
              <button
                key={muscle.value}
                type="button"
                onClick={() => handleMuscleSelect(muscle.value, false)}
                className={`px-3 py-2 rounded font-medium text-sm transition-all ${
                  formData.secondaryMuscles.includes(muscle.value)
                    ? 'bg-purple-600 text-white ring-2 ring-purple-500'
                    : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2E2E2E] border border-[#333]'
                }`}
              >
                {muscle.emoji} {muscle.label}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment, Movement Pattern, Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Equipment
            </label>
            <select
              name="equipment"
              value={formData.equipment}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#333] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
            >
              {EQUIPMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Movement Pattern
            </label>
            <select
              name="movementPattern"
              value={formData.movementPattern}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#333] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
            >
              {MOVEMENT_PATTERNS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.emoji} {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#333] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Visibility
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === 'public'}
                onChange={handleSelectChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-300">🌍 Public (everyone can see)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={formData.visibility === 'private'}
                onChange={handleSelectChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-300">🔒 Private (only you)</span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[#333]">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : initialData ? (
              '💾 Update Exercise'
            ) : (
              '➕ Create Exercise'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
