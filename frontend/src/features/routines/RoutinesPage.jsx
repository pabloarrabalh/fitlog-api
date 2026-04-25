import { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import DynamicForm from '../../components/forms/DynamicForm';
import { useRoutines } from '../../hooks/useRoutines';
import { useExercises } from '../../hooks/useExercises';
import { useToast } from '../../context/ToastContext';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export default function RoutinesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { routines, loading, createRoutine, deleteRoutine, updateRoutine, getRoutineById } = useRoutines();
  const { exercises } = useExercises();
  const { success, error } = useToast();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  const getEntityId = (entity) => {
    if (!entity) return undefined;
    return entity._id || entity.id;
  };

  const getExerciseRefId = (exerciseRef) => {
    if (!exerciseRef) return undefined;
    return exerciseRef._id || exerciseRef.id;
  };
  const reindexExercises = (items = []) =>
    items.map((item, idx) => ({ ...item, order: idx + 1 }));
  
  
  const handleViewRoutine = async (routine) => {
    const routineId = getEntityId(routine);
    try {
      if (!routineId) {
        setSelectedRoutine(routine);
        setViewModalOpen(true);
        return;
      }
      const detailedRoutine = await getRoutineById(routineId);
      setSelectedRoutine(detailedRoutine || routine);
      setViewModalOpen(true);
    } catch {
      setSelectedRoutine(routine);
      setViewModalOpen(true);
    }
  };
  const handleAddExerciseToRoutine = (exerciseId) => {
    const newExercise = {
      exercise: exerciseId,
      order: (selectedRoutine.exercises?.length || 0) + 1,
      targetSets: 3,
      targetRepsMin: 8,
      targetRepsMax: 10,
      targetWeightKg: 0,
      restSeconds: 90,
      notes: '',
    };
    const updatedExercises = [...(selectedRoutine.exercises || []), newExercise];
    setSelectedRoutine({ ...selectedRoutine, exercises: reindexExercises(updatedExercises) });
  };

  const handleUpdateExerciseStats = (index, field, value) => {
    const updatedExercises = [...selectedRoutine.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: parseInt(value) || 0 };
    setSelectedRoutine({ ...selectedRoutine, exercises: updatedExercises });
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = selectedRoutine.exercises.filter((_, i) => i !== index);
    setSelectedRoutine({ ...selectedRoutine, exercises: reindexExercises(updatedExercises) });
  };

  const moveExercise = (index, direction) => {
    const newExercises = [...selectedRoutine.exercises];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newExercises.length) return;
    
    [newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]];
    setSelectedRoutine({ ...selectedRoutine, exercises: reindexExercises(newExercises) });
  };

  const handleSaveRoutineChanges = async () => {
    try {
      const routineId = getEntityId(selectedRoutine);
      const cleanExercises = reindexExercises(selectedRoutine.exercises || []).map((item) => ({
        exercise: getExerciseRefId(item.exercise),
        order: Number(item.order),
        targetSets: Number(item.targetSets),
        targetRepsMin: Number(item.targetRepsMin),
        targetRepsMax: Number(item.targetRepsMax),
        targetWeightKg: Number(item.targetWeightKg ?? 0),
        restSeconds: Number(item.restSeconds ?? 90),
        notes: item.notes || '',
      }));

      const payload = {
        name: selectedRoutine.name,
        objective: selectedRoutine.objective,
        description: selectedRoutine.description,
        exercises: cleanExercises
      };

      await updateRoutine(routineId, payload);
      success('Routine updated successfully!');
      setViewModalOpen(false);
    } catch (err) {
      error('Failed to update routine. Check if all fields are correct.');
    }
  };
  const formFields = [
    {
      name: 'name',
      type: 'text',
      label: 'Routine Name',
      placeholder: 'Push Day',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Routine description',
      rows: 3,
    },
    {
      name: 'objective',
      type: 'select',
      label: 'Objective',
      options: [
        { label: 'Strength', value: 'strength' },
        { label: 'Hypertrophy', value: 'hypertrophy' },
        { label: 'Endurance', value: 'endurance' },
        { label: 'Recomposition', value: 'recomposition' },
      ],
    },
  ];

  const handleCreateRoutine = async (formData) => {
    try {
      await createRoutine(formData);
      success('Routine created successfully!');
      setModalOpen(false);
    } catch {
      error('Failed to create routine');
    }
  };

  const handleDeleteRoutine = async (routineId) => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      try {
        await deleteRoutine(routineId);
        success('Routine deleted');
      } catch {
        error('Failed to delete routine');
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Routines</h1>
          <Button onClick={() => setModalOpen(true)}>+ Create Routine</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </>
          ) : routines.length > 0 ? (
            routines.map((routine) => (
              <Card key={getEntityId(routine)}>
                <CardHeader>
                  <CardTitle>{routine.name}</CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-400 text-sm mb-3">{routine.description}</p>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {routine.objective && (
                      <Badge variant="primary">{routine.objective}</Badge>
                    )}
                    <Badge variant="default">
                      {routine.exercises?.length || 0} exercises
                    </Badge>
                  </div>
                </CardBody>
                <CardFooter className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleViewRoutine(routine)}>
                    View
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteRoutine(getEntityId(routine))}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 mb-4">No routines created yet</p>
              <Button onClick={() => setModalOpen(true)}>Create Your First Routine</Button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Routine">
        <DynamicForm
          fields={formFields}
          onSubmit={handleCreateRoutine}
          submitLabel="Create"
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
      <Modal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        title={`Routine: ${selectedRoutine?.name}`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider text-gray-400">Exercise Order & Details</h3>
            
            <div className="max-h-[45vh] overflow-y-auto pr-1 space-y-2">
              {selectedRoutine?.exercises?.map((item, index) => {
                const exerciseId = getExerciseRefId(item.exercise);
                const exerciseInfo =
                  exercises.find((ex) => getEntityId(ex) === exerciseId) ||
                  (typeof item.exercise === 'object' ? item.exercise : null);
                return (
                  <div key={index} className="flex items-center gap-3 bg-[#252525] p-3 rounded-lg border border-[#333]">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveExercise(index, -1)} className="text-gray-500 hover:text-[#CCFF00] disabled:opacity-20" disabled={index === 0}>
                        <ChevronUp size={18} />
                      </button>
                      <button onClick={() => moveExercise(index, 1)} className="text-gray-500 hover:text-[#CCFF00] disabled:opacity-20" disabled={index === selectedRoutine.exercises.length - 1}>
                        <ChevronDown size={18} />
                      </button>
                    </div>

                    <div className="flex-1 min-w-[120px]">
                      <p className="text-white font-medium text-sm">{exerciseInfo?.name || <span className="italic text-gray-500">Unknown Exercise</span>}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{exerciseInfo?.primaryMuscles?.join(', ') || <span className="italic">No muscles</span>}</p>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-gray-500 font-bold">SETS</span>
                        <input
                          type="number"
                          value={item.targetSets}
                          onChange={(e) => handleUpdateExerciseStats(index, 'targetSets', e.target.value)}
                          className="w-12 bg-black border border-[#444] rounded text-white text-center py-1 text-sm focus:border-[#CCFF00] outline-none"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-gray-500 font-bold">REPS MIN</span>
                        <input
                          type="number"
                          value={item.targetRepsMin}
                          onChange={(e) => handleUpdateExerciseStats(index, 'targetRepsMin', e.target.value)}
                          className="w-12 bg-black border border-[#444] rounded text-white text-center py-1 text-sm focus:border-[#CCFF00] outline-none"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-gray-500 font-bold">REPS MAX</span>
                        <input
                          type="number"
                          value={item.targetRepsMax}
                          onChange={(e) => handleUpdateExerciseStats(index, 'targetRepsMax', e.target.value)}
                          className="w-12 bg-black border border-[#444] rounded text-white text-center py-1 text-sm focus:border-[#CCFF00] outline-none"
                        />
                      </div>
                    </div>

¡                    <button 
                      onClick={() => handleRemoveExercise(index)}
                      className="text-gray-500 hover:text-red-500 transition-colors ml-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
              
              {(!selectedRoutine?.exercises || selectedRoutine.exercises.length === 0) && (
                <div className="text-center py-10 border-2 border-dashed border-[#333] rounded-xl">
                  <p className="text-gray-500">No exercises yet. Add one below!</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#333] space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Add New Exercise</label>
              <select 
                className="w-full bg-black border border-[#333] rounded-lg p-3 text-white text-sm focus:border-[#CCFF00] outline-none transition-all"
                onChange={(e) => {
                  if(e.target.value) handleAddExerciseToRoutine(e.target.value);
                  e.target.value = ""; 
                }}
              >
                <option value="">Search or select exercise...</option>
                {exercises.map(ex => (
                  <option key={getEntityId(ex)} value={getEntityId(ex)}>{ex.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setViewModalOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-[#CCFF00] text-black hover:bg-[#b8e600]" onClick={handleSaveRoutineChanges}>
                Save Routine
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
