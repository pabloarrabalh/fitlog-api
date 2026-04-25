import { useState, useEffect, useCallback } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';
import { useToast } from '../context/ToastContext';

export const useExercises = (query = {}) => {
  const [allExercises, setAllExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0 });
  const [filters, setFilters] = useState({
    q: query.q || '',
    muscle: query.muscle || '',
    equipment: query.equipment || '',
    movementPattern: query.movementPattern || '',
    difficulty: query.difficulty || '',
  });
  const { loading, error, execute } = useApiCall();
  const { error: errorToast } = useToast();

  const fetchExercises = useCallback(async () => {
    try {
      const result = await execute(() => apiClient.get('/exercises'));
      const data = Array.isArray(result.data.data) ? result.data.data : [];
      setAllExercises(data);
      return data;
    } catch (err) {
      errorToast('Failed to fetch exercises');
      return [];
    }
  }, [execute, errorToast]);
  const applyFilters = useCallback((data) => {
    let filtered = data;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name?.toLowerCase().includes(q) ||
          ex.description?.toLowerCase().includes(q)
      );
    }
    if (filters.muscle) {
      filtered = filtered.filter((ex) =>
        ex.primaryMuscles?.includes(filters.muscle)
      );
    }
    if (filters.equipment) {
      filtered = filtered.filter((ex) => ex.equipment === filters.equipment);
    }
    if (filters.movementPattern) {
      filtered = filtered.filter((ex) => ex.movementPattern === filters.movementPattern);
    }

    if (filters.difficulty) {
      filtered = filtered.filter((ex) => ex.difficulty === filters.difficulty);
    }

    return filtered;
  }, [filters]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  useEffect(() => {
    const filtered = applyFilters(allExercises);
    setExercises(filtered);
    setPagination((prev) => ({ ...prev, page: 1, total: filtered.length }));
  }, [filters, allExercises, applyFilters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      q: '',
      muscle: '',
      equipment: '',
      movementPattern: '',
      difficulty: '',
    });
  }, []);

  return {
    exercises,
    loading,
    error,
    pagination,
    filters,
    updateFilter,
    clearFilters,
    fetchExercises,
    setPagination: (p) => setPagination(p),
  };
};

export const useMyExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({
    create: false,
    update: {},
    delete: {},
  });
  const { error: errorToast, success: successToast } = useToast();
  const { execute } = useApiCall();

  // Fetch all user's exercises
  const fetchMyExercises = useCallback(async () => {
    setLoading(true);
    try {
      const result = await execute(() => apiClient.get('/exercises/mine'));
      const data = result.data.data;
      setExercises(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        errorToast('Failed to fetch your exercises');
      }
    } finally {
      setLoading(false);
    }
  }, [execute, errorToast]);

  // Create exercise
  const createExercise = useCallback(
    async (exerciseData) => {
      setOperationLoading((prev) => ({ ...prev, create: true }));
      try {
        const result = await execute(() => apiClient.post('/exercises', exerciseData));
        const newExercise = result.data.data;

        setExercises((prev) => [newExercise, ...prev]);
        return newExercise;
      } catch (err) {
        errorToast(err.response?.data?.message || 'Failed to create exercise');
        throw err;
      } finally {
        setOperationLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [execute, errorToast]
  );

  // Update exercise - ¡CORREGIDO EL ID!
  const updateExercise = useCallback(
    async (exerciseId, exerciseData) => {
      setOperationLoading((prev) => ({
        ...prev,
        update: { ...prev.update, [exerciseId]: true },
      }));

      try {
        const result = await execute(() => apiClient.patch(`/exercises/${exerciseId}`, exerciseData));
        const updatedExercise = result.data.data;

        // Utilizamos (e._id || e.id) para asegurar que encuentra la coincidencia
        setExercises((prev) =>
          prev.map((e) => ((e._id || e.id) === exerciseId ? updatedExercise : e))
        );
        return updatedExercise;
      } catch (err) {
        errorToast(err.response?.data?.message || 'Failed to update exercise');
        throw err;
      } finally {
        setOperationLoading((prev) => ({
          ...prev,
          update: { ...prev.update, [exerciseId]: false },
        }));
      }
    },
    [execute, errorToast]
  );

  // Delete exercise - ¡CORREGIDO EL ID!
  const deleteExercise = useCallback(
    async (exerciseId) => {
      setOperationLoading((prev) => ({
        ...prev,
        delete: { ...prev.delete, [exerciseId]: true },
      }));

      try {
        await execute(() => apiClient.delete(`/exercises/${exerciseId}`));
        setExercises((prev) => prev.filter((e) => (e._id || e.id) !== exerciseId));
      } catch (err) {
        errorToast(err.response?.data?.message || 'Failed to delete exercise');
        throw err;
      } finally {
        setOperationLoading((prev) => ({
          ...prev,
          delete: { ...prev.delete, [exerciseId]: false },
        }));
      }
    },
    [execute, errorToast]
  );

  const getExerciseById = useCallback(
    async (exerciseId) => {
      try {
        const result = await execute(() => apiClient.get(`/exercises/${exerciseId}`));
        return result.data.data;
      } catch (err) {
        errorToast('Failed to fetch exercise details');
        throw err;
      }
    },
    [execute, errorToast]
  );

  useEffect(() => {
    fetchMyExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    exercises,
    loading,
    operationLoading,
    fetchMyExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    getExerciseById,
  };
};
