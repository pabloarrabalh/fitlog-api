import { useState, useEffect } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';

export const useSocial = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error, execute } = useApiCall();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const result = await execute(() => apiClient.get('/social/friends'));
      // res.data.data contains the actual array of friends
      setFriends(result.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const addFriend = async (friendId) => {
    const result = await execute(() =>
      apiClient.post(`/social/friends/${friendId}`)
    );
    const newFriend = result.data.data;
    setFriends((prev) => [...prev, newFriend]);
    return newFriend;
  };

  const removeFriend = async (friendId) => {
    await execute(() => apiClient.delete(`/social/friends/${friendId}`));
    setFriends((prev) => prev.filter((f) => f._id !== friendId));
  };

  const getFriendWorkouts = async (friendId) => {
    const result = await execute(() =>
      apiClient.get(`/social/friends/${friendId}/workouts`)
    );
    return result.data.data;
  };

  return {
    friends,
    loading,
    error,
    addFriend,
    removeFriend,
    getFriendWorkouts,
    refetch: fetchFriends,
  };
};
