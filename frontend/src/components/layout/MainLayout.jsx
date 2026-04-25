import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock3 } from 'lucide-react';
import Navbar from './Navbar';
import { useSessions } from '../../hooks/useSessions';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { sessions, refetch } = useSessions();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const activeSession = useMemo(() => {
    const active = sessions
      .filter((session) => session.status === 'in_progress')
      .sort(
        (a, b) =>
          new Date(b.startedAt || b.createdAt || 0).getTime() -
          new Date(a.startedAt || a.createdAt || 0).getTime()
      );
    return active[0] || null;
  }, [sessions]);

  useEffect(() => {
    if (!activeSession?.startedAt) {
      setElapsedSeconds(0);
      return undefined;
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - new Date(activeSession.startedAt).getTime()) / 1000);
      setElapsedSeconds(Math.max(0, elapsed));
    };

    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [activeSession?.startedAt]);

  useEffect(() => {
    const refresh = () => {
      refetch();
    };

    refresh();
    const intervalId = setInterval(refresh, 5000);
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refetch]);

  const formatSeconds = (seconds) => {
    const safe = Math.max(0, Number(seconds) || 0);
    const mins = String(Math.floor(safe / 60)).padStart(2, '0');
    const secs = String(safe % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const openActiveWorkout = () => {
    const sessionId = activeSession?.id || activeSession?._id;
    if (!sessionId) return;
    navigate(`/sessions?resume=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${activeSession ? 'pb-28' : ''}`}>
        {children}
      </main>
      {activeSession && (
        <button
          type="button"
          onClick={openActiveWorkout}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[min(900px,calc(100vw-24px))] rounded-lg border border-[#CCFF00]/50 bg-[#181818] px-4 py-3 flex items-center justify-between z-40"
        >
          <div className="text-left">
            <p className="text-xs uppercase text-gray-400">Sesion activa</p>
            <p className="text-white font-semibold">{activeSession.routine?.name || 'Sesion libre'}</p>
          </div>
          <div className="flex items-center gap-2 text-[#CCFF00]">
            <Clock3 size={16} />
            <span className="font-semibold">{formatSeconds(elapsedSeconds)}</span>
          </div>
        </button>
      )}
    </div>
  );
}
