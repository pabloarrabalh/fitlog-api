import { useState, useEffect } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';

export const useSessions = () => {
  const [sessions, setSession] = useState([]);
  const { loading, error, execute } = useApiCall();

  const fetchSessions = async () => {
    const result = await execute(() => apiClient.get('/sessions'));
    // res.data.data contains the actual array of sessions
    setSession(result.data.data || []);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const createSession = async (sessionData) => {
    const result = await execute(() =>
      apiClient.post('/sessions', sessionData)
    );
    const newSession = result.data.data;
    setSession((prev) => [...prev, newSession]);
    return newSession;
  };

  const updateSession = async (sessionId, sessionData) => {
    const result = await execute(() =>
      apiClient.put(`/sessions/${sessionId}`, sessionData)
    );
    const updatedSession = result.data.data;
    setSession((prev) =>
      prev.map((s) => (s._id === sessionId ? updatedSession : s))
    );
    return updatedSession;
  };

  const addSetToEntry = async (sessionId, entryId, setData) => {
    const result = await execute(() =>
      apiClient.post(`/sessions/${sessionId}/entries/${entryId}/sets`, setData)
    );
    return result.data.data;
  };

  const completeSession = async (sessionId, data) => {
    const result = await execute(() =>
      apiClient.put(`/sessions/${sessionId}/complete`, data)
    );
    const completedSession = result.data.data;
    setSession((prev) =>
      prev.map((s) => (s._id === sessionId ? completedSession : s))
    );
    return completedSession;
  };

  const deleteSession = async (sessionId) => {
    await execute(() => apiClient.delete(`/sessions/${sessionId}`));
    setSession((prev) => prev.filter((s) => s._id !== sessionId));
  };

  const getSessionById = async (sessionId) => {
    const result = await execute(() => apiClient.get(`/sessions/${sessionId}`));
    return result.data.data;
  };

  return {
    sessions,
    loading,
    error,
    createSession,
    updateSession,
    addSetToEntry,
    completeSession,
    deleteSession,
    getSessionById,
    refetch: fetchSessions,
  };
};
