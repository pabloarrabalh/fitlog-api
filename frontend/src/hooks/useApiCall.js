import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { error: errorToast } = useToast();

  const execute = useCallback(async (apiFunction) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      setError(message);
      // Don't show toast for auth errors (401/403) - let api interceptor handle redirects
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        errorToast(message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [errorToast]);

  return { loading, error, execute };
};
