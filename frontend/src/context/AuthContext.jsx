import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() =>
    localStorage.getItem('authToken') !== null
  );

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient
        .get('/users/me')
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('authToken');
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    // Backend returns: { success: true, data: { token, user, ... } }
    // res.data.data contains the actual data with token
    const token = res.data.data?.token;
    if (!token) throw new Error('No token in response');
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    const userRes = await apiClient.get('/users/me');
    setUser(userRes.data.data);
    return userRes.data.data;
  };

  const register = async (formData) => {
    const res = await apiClient.post('/auth/register', formData);
    // Backend returns: { success: true, data: { token, user, ... } }
    const token = res.data.data?.token;
    if (!token) throw new Error('No token in response');
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    const userRes = await apiClient.get('/users/me');
    setUser(userRes.data.data);
    return userRes.data.data;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
