import { useState } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const { loading, error, execute } = useApiCall();

  const updateProfile = async (userData) => {
    const result = await execute(() =>
      apiClient.put('/users/me', userData)
    );
    // res.data.data contains the updated user profile
    const updatedProfile = result.data.data;
    setProfile(updatedProfile);
    return updatedProfile;
  };

  const deleteProfile = async () => {
    return execute(() => apiClient.delete('/users/me'));
  };

  return {
    profile: profile || user,
    loading: loading || authLoading,
    error,
    updateProfile,
    deleteProfile,
  };
};
