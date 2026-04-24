import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axiosInstance
        .get('/users/me')
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
    }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    const token = res.data?.data?.token;
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
    const userRes = await axiosInstance.get('/users/me');
    setUser(userRes.data.data);
    return userRes.data.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
