import { useState, useEffect, useCallback } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';

export const useSocial = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({
    add: false,
    remove: {},
    workouts: {}
  });
  const { error, execute } = useApiCall();

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      const result = await execute(() => apiClient.get('/social/friends'));
      setFriends(result.data.data || []);
    } finally {
      setLoading(false);
    }
  }, [execute]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // Envolvemos en useCallback
  const addFriend = useCallback(async (friendUsername) => {
    setOperationLoading(prev => ({ ...prev, add: true }));
    try {
      await execute(() => apiClient.post(`/social/friends/${friendUsername}`));
      await fetchFriends();
      return true;
    } finally {
      setOperationLoading(prev => ({ ...prev, add: false }));
    }
  }, [execute, fetchFriends]);

  // Envolvemos en useCallback
  const removeFriend = useCallback(async (friendId) => {
    setOperationLoading(prev => ({ ...prev, remove: { ...prev.remove, [friendId]: true } }));
    try {
      await execute(() => apiClient.delete(`/social/friends/${friendId}`));
      setFriends(prev => prev.filter(f => (f._id || f.id) !== friendId));
    } finally {
      setOperationLoading(prev => ({ ...prev, remove: { ...prev.remove, [friendId]: false } }));
    }
  }, [execute]);

  // EL MÁS IMPORTANTE: Este causaba el bucle
  const getFriendWorkouts = useCallback(async (friendId) => {
    setOperationLoading(prev => ({ ...prev, workouts: { ...prev.workouts, [friendId]: true } }));
    try {
      const result = await execute(() => apiClient.get(`/social/friends/${friendId}/workouts`));
      return result.data.data;
    } finally {
      setOperationLoading(prev => ({ ...prev, workouts: { ...prev.workouts, [friendId]: false } }));
    }
  }, [execute]);

  return {
    friends,
    loading,
    operationLoading,
    error,
    addFriend,
    removeFriend,
    getFriendWorkouts,
    refetch: fetchFriends,
  };
};