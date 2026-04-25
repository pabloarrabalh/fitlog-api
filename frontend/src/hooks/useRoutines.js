import { useState, useEffect } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';

export const useRoutines = () => {
  const [routines, setRoutines] = useState([]);
  const { loading, error, execute } = useApiCall();

  const fetchRoutines = async () => {
    const result = await execute(() => apiClient.get('/routines'));
    // res.data.data contains the actual array of routines
    setRoutines(result.data.data || []);
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const createRoutine = async (routineData) => {
    const result = await execute(() =>
      apiClient.post('/routines', routineData)
    );
    const newRoutine = result.data.data;
    setRoutines((prev) => [...prev, newRoutine]);
    return newRoutine;
  };

  const updateRoutine = async (routineId, routineData) => {
    const result = await execute(() =>
      apiClient.put(`/routines/${routineId}`, routineData)
    );
    const updatedRoutine = result.data.data;
    setRoutines((prev) =>
      prev.map((r) => (r._id === routineId ? updatedRoutine : r))
    );
    return updatedRoutine;
  };

  const deleteRoutine = async (routineId) => {
    await execute(() => apiClient.delete(`/routines/${routineId}`));
    setRoutines((prev) => prev.filter((r) => r._id !== routineId));
  };

  const getRoutineById = async (routineId) => {
    const result = await execute(() => apiClient.get(`/routines/${routineId}`));
    return result.data.data;
  };

  return {
    routines,
    loading,
    error,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutineById,
    refetch: fetchRoutines,
  };
};
