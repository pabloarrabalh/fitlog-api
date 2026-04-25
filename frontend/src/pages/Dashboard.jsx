import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [friends, setFriends] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchFriends = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/social/friends');
      // res.data.data contains the actual array of friends
      setFriends(res.data.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Error al obtener amigos';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <p>{user ? `Bienvenido, ${user.firstName}` : 'Cargando o no autorizado'}</p>
      <button onClick={logout}>Logout</button>
      <button onClick={handleFetchFriends} disabled={loading}>
        {loading ? 'Cargando...' : 'Obtener Amigos'}
      </button>
      {error && <p>{error}</p>}
      {friends && <pre>{JSON.stringify(friends, null, 2)}</pre>}
    </main>
  );
}
