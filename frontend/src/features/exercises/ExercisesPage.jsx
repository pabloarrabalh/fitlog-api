import { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import ExerciseFormModal from './ExerciseFormModal';
import ExerciseBrowseSection from './ExerciseBrowseSection';
import ExerciseMySection from './ExerciseMySection';
import { useExercises, useMyExercises } from '../../hooks/useExercises';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useAdminExercises } from '../../hooks/useAdminExercises';
import ExercisePendingSection from './ExercisesPendingSection';

export default function ExercisesPage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { user } = useAuth();

  // Browse exercises
  const {
    exercises: browseExercises,
    loading: browseLoading,
    filters,
    updateFilter,
    clearFilters,
  } = useExercises();

  // My exercises (CRUD)
  const {
    exercises: myExercises,
    loading: myLoading,
    operationLoading,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useMyExercises();
  const {
    pendingExercises,
    loading: pendingLoading,
    operationLoading: adminOpLoading,
    approveExercise,
    rejectExercise
  } = useAdminExercises();
  const { success, error } = useToast();

  // Form handlers
  const handleCreateNew = () => {
    setEditingExercise(null);
    setModalOpen(true);
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setModalOpen(true);
  };

  const handleCreateOrUpdate = async (submission) => {
    try {
      console.log('📝 handleCreateOrUpdate called:', JSON.stringify(submission, null, 2));

      const { exerciseId, data: formData } = submission;

      console.log('🔍 Decision logic:', {
        hasExerciseId: !!exerciseId,
        exerciseId: exerciseId,
      });

      if (exerciseId) {
        console.log(`🔄 UPDATING exercise ${exerciseId}`);
        await updateExercise(exerciseId, formData);
        success('Exercise updated successfully');
      } else {
        console.log('✨ CREATING new exercise');
        await createExercise(formData);
        success('Exercise created successfully');
      }
      setModalOpen(false);
      setEditingExercise(null);
    } catch (err) {
      console.error('Error in handleCreateOrUpdate:', err);
      error(err.message || 'Failed to save exercise');
    }
  };

  const handleDeleteExercise = async (id) => {
    try {
      await deleteExercise(id);
      success('Exercise deleted successfully');
      setDeleteConfirmId(null);
    } catch (err) {
      error(err.message || 'Failed to delete exercise');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingExercise(null);
  };
return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with title and create button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">🏋️ Exercises</h1>
            <p className="text-gray-400 text-sm mt-1">Browse or manage your exercise library</p>
          </div>
          {activeTab === 'mine' && (
            <Button
              onClick={handleCreateNew}
              className="bg-[#CCFF00] text-black hover:bg-opacity-90"
            >
              + Create Exercise
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#333] overflow-x-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'browse'
                ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🌍 Browse Library
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'mine'
                ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📝 My Exercises
          </button>

          {/* Pestaña de Admin */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🛡️ Pending Approvals
              {pendingExercises?.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingExercises.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Browse Section */}
        {activeTab === 'browse' && (
          <ExerciseBrowseSection
            exercises={browseExercises}
            loading={browseLoading}
            filters={filters}
            onFilterChange={(filterType, value) => updateFilter(filterType, value)}
            onClearFilters={clearFilters}
          />
        )}

        {/* My Exercises Section */}
        {activeTab === 'mine' && (
          <ExerciseMySection
            exercises={myExercises}
            loading={myLoading}
            operationLoading={operationLoading}
            onEdit={handleEditExercise}
            onDelete={(id) => setDeleteConfirmId(id)}
          />
        )}

        {/* Admin Pending Section */}
        {activeTab === 'pending' && user?.role === 'admin' && (
          <ExercisePendingSection
            exercises={pendingExercises}
            loading={pendingLoading}
            operationLoading={adminOpLoading}
            onApprove={approveExercise}
            onReject={rejectExercise}
          />
        )}
      </div>

      {/* Create/Edit Form Modal */}
      <ExerciseFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdate}
        initialData={editingExercise}
        isLoading={operationLoading.create || (editingExercise && operationLoading.update[editingExercise._id])}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-lg p-6 max-w-sm w-full border border-[#333]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🗑️</span>
              <h2 className="text-xl font-bold text-white">Delete Exercise?</h2>
            </div>

            <p className="text-gray-300 mb-6">
              This action cannot be undone. Are you sure you want to delete this exercise?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteExercise(deleteConfirmId)}
                disabled={operationLoading.delete[deleteConfirmId]}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {operationLoading.delete[deleteConfirmId] ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}