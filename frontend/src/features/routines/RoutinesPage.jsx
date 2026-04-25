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

export default function RoutinesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { routines, loading, createRoutine, deleteRoutine, updateRoutine } = useRoutines();
  const { exercises } = useExercises();
  const { success, error } = useToast();

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
              <Card key={routine._id}>
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
                  <Button size="sm" variant="secondary" className="flex-1">
                    View
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1">
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteRoutine(routine._id)}
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
    </MainLayout>
  );
}
