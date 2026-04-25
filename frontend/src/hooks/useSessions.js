import { useState, useEffect, useCallback } from 'react';
import { useApiCall } from './useApiCall';
import apiClient from '../services/api';

export const useSessions = () => {
  const [sessions, setSession] = useState([]);
  const { loading, error, execute } = useApiCall();
  const getSessionId = (session) => session?._id || session?.id;

  const fetchSessions = useCallback(async () => {
    const result = await execute(() => apiClient.get('/sessions'));
    // res.data.data contains the actual array of sessions
    setSession(result.data.data || []);
  }, [execute]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

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
      apiClient.patch(`/sessions/${sessionId}`, sessionData)
    );
    const updatedSession = result.data.data;
    setSession((prev) =>
      prev.map((s) => (getSessionId(s) === sessionId ? updatedSession : s))
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
      apiClient.post(`/sessions/${sessionId}/complete`, data)
    );
    const completedSession = result.data.data;
    setSession((prev) =>
      prev.map((s) => (getSessionId(s) === sessionId ? completedSession : s))
    );
    return completedSession;
  };

  const deleteSession = async (sessionId) => {
    await execute(() => apiClient.delete(`/sessions/${sessionId}`));
    setSession((prev) => prev.filter((s) => getSessionId(s) !== sessionId));
  };

  const cancelSession = async (sessionId) => {
    await execute(() => apiClient.post(`/sessions/${sessionId}/cancel`));
    setSession((prev) => prev.filter((s) => getSessionId(s) !== sessionId));
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
    cancelSession,
    getSessionById,
    refetch: fetchSessions,
  };
};
