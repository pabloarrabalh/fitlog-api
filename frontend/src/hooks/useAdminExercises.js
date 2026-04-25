import { useState, useCallback, useEffect } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const useAdminExercises = () => {
  const [pendingExercises, setPendingExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({
    approve: {},
    reject: {},
  });

  const { execute } = useApiCall();
  const { error: errorToast, success: successToast } = useToast();
  const { user } = useAuth(); // 2. Sacamos al usuario logueado

  const fetchPendingExercises = useCallback(async () => {
    if (user?.role !== 'admin') return;

    setLoading(true);
    try {
      const result = await execute(() => apiClient.get('/exercises/pending'));
      setPendingExercises(result.data.data || []);
    } catch (err) {
      errorToast('Failed to fetch pending exercises');
      console.error('Error fetching pending exercises:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [execute, errorToast, user?.role]);

  const approveExercise = useCallback(async (id) => {
    setOperationLoading(prev => ({ ...prev, approve: { ...prev.approve, [id]: true } }));
    try {
      await execute(() => apiClient.patch(`/exercises/${id}/approve`));
      setPendingExercises(prev => prev.filter(e => (e._id || e.id) !== id));
      successToast('Exercise approved and published!');
    } catch (err) {
      errorToast(err.response?.data?.message || 'Failed to approve exercise');
    } finally {
      setOperationLoading(prev => ({ ...prev, approve: { ...prev.approve, [id]: false } }));
    }
  }, [execute, errorToast, successToast]);

  const rejectExercise = useCallback(async (id) => {
    setOperationLoading(prev => ({ ...prev, reject: { ...prev.reject, [id]: true } }));
    try {
      await execute(() => apiClient.patch(`/exercises/${id}/reject`));
      setPendingExercises(prev => prev.filter(e => (e._id || e.id) !== id));
      successToast('Exercise rejected');
    } catch (err) {
      errorToast(err.response?.data?.message || 'Failed to reject exercise');
    } finally {
      setOperationLoading(prev => ({ ...prev, reject: { ...prev.reject, [id]: false } }));
    }
  }, [execute, errorToast, successToast]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPendingExercises();
    }
  }, [user?.role, fetchPendingExercises]);

  return {
    pendingExercises,
    loading,
    operationLoading,
    approveExercise,
    rejectExercise,
    fetchPendingExercises
  };
};