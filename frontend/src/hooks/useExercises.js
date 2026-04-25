import { useState, useEffect, useCallback } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';
import { useToast } from '../context/ToastContext';

/**
 * Hook for browsing exercises (public library with filters & search)
 * Handles: search, filters, pagination
 */
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

  // Fetch all exercises once
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

  // Apply filters to all exercises
  const applyFilters = useCallback((data) => {
    let filtered = data;

    // Search by name or description
    if (filters.q) {
      const q = filters.q.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name?.toLowerCase().includes(q) ||
          ex.description?.toLowerCase().includes(q)
      );
    }

    // Filter by primary muscle
    if (filters.muscle) {
      filtered = filtered.filter((ex) =>
        ex.primaryMuscles?.includes(filters.muscle)
      );
    }

    // Filter by equipment
    if (filters.equipment) {
      filtered = filtered.filter((ex) => ex.equipment === filters.equipment);
    }

    // Filter by movement pattern
    if (filters.movementPattern) {
      filtered = filtered.filter((ex) => ex.movementPattern === filters.movementPattern);
    }

    // Filter by difficulty
    if (filters.difficulty) {
      filtered = filtered.filter((ex) => ex.difficulty === filters.difficulty);
    }

    return filtered;
  }, [filters]);

  // Fetch on component mount
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  // Apply filters when filters or all exercises change
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

/**
 * Hook for managing user's own exercises (CRUD operations)
 * Handles: list, create, update, delete with optimistic updates
 */
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
      console.error('Fetch my exercises error:', err.response?.status, err.response?.data);
      // Only show error if it's an actual error (not 401/403 on first load)
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        errorToast('Failed to fetch your exercises');
      }
    } finally {
      setLoading(false);
    }
  }, [execute, errorToast]);

  // Create exercise - NO optimistic update, wait for server confirmation
  const createExercise = useCallback(
    async (exerciseData) => {
      setOperationLoading((prev) => ({ ...prev, create: true }));
      try {
        console.log('📤 Sending POST request to backend:', {
          url: '/exercises',
          method: 'POST',
          data: exerciseData,
        });

        const result = await execute(() =>
          apiClient.post('/exercises', exerciseData)
        );

        console.log('✅ Backend response:', result.data);

        const newExercise = result.data.data;

        // Update state ONLY after server confirms
        setExercises((prev) => [newExercise, ...prev]);
        successToast('Exercise created successfully!');
        return newExercise;
      } catch (err) {
        console.error('❌ Create failed:', {
          status: err.response?.status,
          message: err.response?.data?.message,
          error: err.message,
        });
        errorToast(err.response?.data?.message || 'Failed to create exercise');
        throw err;
      } finally {
        setOperationLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [execute, errorToast, successToast]
  );

  // Update exercise - NO optimistic update, wait for server confirmation
  const updateExercise = useCallback(
    async (exerciseId, exerciseData) => {
      setOperationLoading((prev) => ({
        ...prev,
        update: { ...prev.update, [exerciseId]: true },
      }));

      try {
        console.log('🔄 Sending PATCH request to backend:', {
          url: `/exercises/${exerciseId}`,
          method: 'PATCH',
          data: exerciseData,
        });

        const result = await execute(() =>
          apiClient.patch(`/exercises/${exerciseId}`, exerciseData)
        );

        console.log('✅ Backend response:', result.data);

        const updatedExercise = result.data.data;

        // Update state ONLY after server confirms
        setExercises((prev) =>
          prev.map((e) => (e._id === exerciseId ? updatedExercise : e))
        );
        successToast('Exercise updated successfully!');
        return updatedExercise;
      } catch (err) {
        console.error('❌ Update failed:', {
          status: err.response?.status,
          message: err.response?.data?.message,
          error: err.message,
        });
        errorToast(err.response?.data?.message || 'Failed to update exercise');
        throw err;
      } finally {
        setOperationLoading((prev) => ({
          ...prev,
          update: { ...prev.update, [exerciseId]: false },
        }));
      }
    },
    [execute, errorToast, successToast]
  );

  // Delete exercise - NO optimistic update, wait for server confirmation
  const deleteExercise = useCallback(
    async (exerciseId) => {
      setOperationLoading((prev) => ({
        ...prev,
        delete: { ...prev.delete, [exerciseId]: true },
      }));

      try {
        console.log('🗑️ Sending DELETE request to backend:', {
          url: `/exercises/${exerciseId}`,
          method: 'DELETE',
        });

        const result = await execute(() =>
          apiClient.delete(`/exercises/${exerciseId}`)
        );

        console.log('✅ Backend response:', result.data);

        // Update state ONLY after server confirms
        setExercises((prev) => prev.filter((e) => e._id !== exerciseId));
        successToast('Exercise deleted successfully!');
      } catch (err) {
        console.error('❌ Delete failed:', {
          status: err.response?.status,
          message: err.response?.data?.message,
          error: err.message,
        });
        errorToast(err.response?.data?.message || 'Failed to delete exercise');
        throw err;
      } finally {
        setOperationLoading((prev) => ({
          ...prev,
          delete: { ...prev.delete, [exerciseId]: false },
        }));
      }
    },
    [execute, errorToast, successToast]
  );

  // Fetch a single exercise by ID
  const getExerciseById = useCallback(
    async (exerciseId) => {
      try {
        const result = await execute(() =>
          apiClient.get(`/exercises/${exerciseId}`)
        );
        return result.data.data;
      } catch (err) {
        errorToast('Failed to fetch exercise details');
        throw err;
      }
    },
    [execute, errorToast]
  );

  useEffect(() => {
    // Only fetch once on mount, not when fetchMyExercises changes
    fetchMyExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array: only run on mount

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
