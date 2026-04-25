import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronUp, ChevronDown, Plus, Trash2, Check } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useSessions } from '../../hooks/useSessions';
import { useToast } from '../../context/ToastContext';
import { useRoutines } from '../../hooks/useRoutines';
import { useExercises } from '../../hooks/useExercises';

const DEFAULT_SETS = 3;
const DEFAULT_REPS = 8;
const DEFAULT_REST_SECONDS = 120;

const getId = (item) => {
  if (!item) return undefined;
  if (typeof item === 'string') return item;
  return item.id || item._id;
};

const formatSeconds = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const mins = String(Math.floor(safe / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const normalizeSets = (sets = []) =>
  sets.map((set, idx) => ({ ...set, setNumber: idx + 1 }));

const normalizeEntries = (entries = []) =>
  entries.map((entry, idx) => ({ ...entry, order: idx + 1 }));

const getDisplayValue = (value) => (value === '' || value === null || value === undefined ? '' : value);

export default function SessionsPage() {
  const {sessions,loading,createSession,getSessionById,updateSession,completeSession,deleteSession,cancelSession,refetch,} = useSessions();
  const { routines } = useRoutines();
  const { exercises } = useExercises();
  const { success, error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [startModalOpen, setStartModalOpen] = useState(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [sessionDetailsModalOpen, setSessionDetailsModalOpen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);

  const [startMode, setStartMode] = useState('empty');
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [newExerciseId, setNewExerciseId] = useState('');

  const [activeSession, setActiveSession] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restSecondsDefault, setRestSecondsDefault] = useState(DEFAULT_REST_SECONDS);
  const [restRemaining, setRestRemaining] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const [showRestAlert, setShowRestAlert] = useState(false);
  const [draftDirty, setDraftDirty] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const resumeSessionId = searchParams.get('resume');

  const exerciseMap = useMemo(() => {
    const map = new Map();
    exercises.forEach((exercise) => {
      map.set(getId(exercise), exercise);
    });
    return map;
  }, [exercises]);

  const orderedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) =>
          new Date(b.startedAt || b.createdAt || 0).getTime() -
          new Date(a.startedAt || a.createdAt || 0).getTime()
      ),
    [sessions]
  );
  const hasInProgressSession = useMemo(
    () => sessions.some((session) => session.status === 'in_progress'),
    [sessions]
  );

  useEffect(() => {
    if (!activeSession?.startedAt) return undefined;

    const tick = () => {
      const since = Math.floor((Date.now() - new Date(activeSession.startedAt).getTime()) / 1000);
      setElapsedSeconds(Math.max(0, since));
    };

    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [activeSession?.startedAt]);

  useEffect(() => {
    if (!restRunning) return undefined;

    const timerId = setInterval(() => {
      setRestRemaining((previous) => {
        if (previous <= 1) {
          clearInterval(timerId);
          setRestRunning(false);
          setShowRestAlert(true);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [restRunning]);

  const getSessionStatusVariant = (status) => {
    if (status === 'in_progress') return 'success';
    if (status === 'completed') return 'default';
    return 'default';
  };

  const makeExerciseDraft = (exerciseId, order, overrides = {}) => {
    const info = exerciseMap.get(exerciseId) || {};
    const plannedSets = overrides.plannedSets || DEFAULT_SETS;
    const repsPlaceholder = overrides.plannedRepsMin || DEFAULT_REPS;
    const performedSets = Array.isArray(overrides.performedSets) ? overrides.performedSets : [];

    const sets = Array.from({ length: plannedSets }).map((_, idx) => {
      const done = performedSets.find((set) => set.setNumber === idx + 1);
      return {
        setNumber: idx + 1,
        reps: done ? Number(done.reps) : '',
        weightKg: done ? Number(done.weightKg) : '',
        repsPlaceholder: Number(repsPlaceholder),
        weightPlaceholder: 0,
        completed: Boolean(done?.completed),
      };
    });

    return {
      entryId: overrides.entryId,
      exerciseId,
      exerciseName: info.name || overrides.exerciseName || 'Unknown Exercise',
      primaryMuscles: info.primaryMuscles || overrides.primaryMuscles || [],
      order,
      restSeconds: Number(overrides.restSeconds ?? DEFAULT_REST_SECONDS),
      notes: overrides.notes || '',
      sets,
    };
  };

  const buildDraftFromSession = (session) => {
    const entries = (session.entries || [])
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((entry, idx) => {
        const exerciseId = getId(entry.exercise);
        const entryInfo = typeof entry.exercise === 'object' ? entry.exercise : null;
        return makeExerciseDraft(exerciseId, idx + 1, {
          entryId: getId(entry),
          plannedSets: Number(entry.plannedSets || DEFAULT_SETS),
          plannedRepsMin: Number(entry.plannedRepsMin || DEFAULT_REPS),
          plannedRepsMax: Number(entry.plannedRepsMax || DEFAULT_REPS),
          plannedWeightKg: Number(entry.plannedWeightKg || 0),
          restSeconds: Number(entry.restSeconds || DEFAULT_REST_SECONDS),
          notes: entry.notes || '',
          performedSets: entry.performedSets || [],
          exerciseName: entryInfo?.name,
          primaryMuscles: entryInfo?.primaryMuscles || [],
        });
      });

    return {
      id: getId(session),
      routineId: getId(session.routine),
      name: session.name || session.routine?.name || 'Sesión libre',
      objective: session.objective || 'hypertrophy',
      startedAt: session.startedAt || new Date().toISOString(),
      entries: normalizeEntries(entries),
    };
  };

  useEffect(() => {
    if (!resumeSessionId) return;
    let cancelled = false;

    const openFromQuery = async () => {
      try {
        const fresh = await getSessionById(resumeSessionId);
        if (cancelled) return;
        const draft = buildDraftFromSession(fresh);
        setActiveSession(draft);
        setDraftDirty(false);
        setWorkoutModalOpen(true);
      } catch {
        if (!cancelled) error('Failed to load workout');
      } finally {
        if (!cancelled) {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.delete('resume');
          setSearchParams(nextParams, { replace: true });
        }
      }
    };

    openFromQuery();
    return () => {
      cancelled = true;
    };
  }, [resumeSessionId]);

  const startRest = (seconds = restSecondsDefault) => {
    const next = Math.max(1, Number(seconds) || DEFAULT_REST_SECONDS);
    setRestRunning(false);
    setShowRestAlert(false);
    setRestRemaining(next);
    setRestRunning(true);
  };

  const stopRest = () => {
    setRestRunning(false);
    setRestRemaining(0);
    setShowRestAlert(false);
  };

  const handleStartSession = async () => {
    if (hasInProgressSession) {
      error('Ya tienes un entreno activo. Vuelve a ese entreno antes de crear otro.');
      return;
    }
    try {
      const payload =
        startMode === 'routine'
          ? { routineId: selectedRoutineId }
          : { name: sessionName, objective: 'hypertrophy', exercises: [] };

      const created = await createSession(payload);
      const fresh = await getSessionById(getId(created));
      const draft = buildDraftFromSession(fresh);

      setActiveSession(draft);
      setElapsedSeconds(0);
      setRestSecondsDefault(DEFAULT_REST_SECONDS);
      stopRest();
      setDraftDirty(false);
      setStartModalOpen(false);
      setWorkoutModalOpen(true);
      success('Session started');
    } catch {
      error('Failed to start session');
    }
  };

  const handleDeleteSession = async (session) => {
    if (session?.status === 'in_progress') {
      error('No puedes borrar un entreno activo.');
      return;
    }
    const sessionId = getId(session);
    if (!window.confirm('Delete this session?')) return;
    try {
      await deleteSession(sessionId);
      success('Session deleted');
    } catch {
      error('Failed to delete session');
    }
  };

  const handleResumeSession = async (sessionId) => {
    try {
      const fresh = await getSessionById(sessionId);
      const draft = buildDraftFromSession(fresh);
      setActiveSession(draft);
      setDraftDirty(false);
      setWorkoutModalOpen(true);
      success('Workout loaded');
    } catch {
      error('Failed to load workout');
    }
  };

  const handleViewSessionDetails = async (sessionId) => {
    try {
      const fresh = await getSessionById(sessionId);
      setSessionDetails(fresh);
      setSessionDetailsModalOpen(true);
    } catch {
      error('Failed to load session details');
    }
  };

  const updateEntrySetField = (entryIndex, setIndex, field, value) => {
    if (!activeSession) return;
    const nextEntries = [...activeSession.entries];
    const targetSet = nextEntries[entryIndex].sets[setIndex];
    const nextFieldValue = value === '' ? '' : Math.max(0, Number(value) || 0);
    nextEntries[entryIndex].sets[setIndex] = {
      ...targetSet,
      [field]: nextFieldValue,
    };
    setActiveSession({ ...activeSession, entries: nextEntries });
    setDraftDirty(true);
  };

  const toggleSetCompleted = (entryIndex, setIndex) => {
    if (!activeSession) return;
    const nextEntries = [...activeSession.entries];
    const target = nextEntries[entryIndex].sets[setIndex];
    const hasValidData = Number(target.reps) > 0 && Number(target.weightKg) > 0;
    if (!target.completed && !hasValidData) return;
    const nextValue = !target.completed;
    nextEntries[entryIndex].sets[setIndex] = { ...target, completed: nextValue };
    setActiveSession({ ...activeSession, entries: nextEntries });
    setDraftDirty(true);
    if (nextValue) {
      const restForExercise = Number(nextEntries[entryIndex].restSeconds || restSecondsDefault);
      startRest(restForExercise);
    }
  };

  const addSetToExercise = (entryIndex) => {
    if (!activeSession) return;
    const nextEntries = [...activeSession.entries];
    const currentSets = nextEntries[entryIndex].sets;
    const lastSet = currentSets[currentSets.length - 1] || { repsPlaceholder: DEFAULT_REPS };
    nextEntries[entryIndex].sets = normalizeSets([
      ...currentSets,
      {
        setNumber: currentSets.length + 1,
        reps: '',
        weightKg: '',
        repsPlaceholder: Number(lastSet.repsPlaceholder || DEFAULT_REPS),
        weightPlaceholder: 0,
        completed: false,
      },
    ]);
    setActiveSession({ ...activeSession, entries: nextEntries });
    setDraftDirty(true);
  };

  const removeSetFromExercise = (entryIndex) => {
    if (!activeSession) return;
    const nextEntries = [...activeSession.entries];
    const currentSets = nextEntries[entryIndex].sets;
    if (currentSets.length <= 1) return;
    nextEntries[entryIndex].sets = normalizeSets(currentSets.slice(0, -1));
    setActiveSession({ ...activeSession, entries: nextEntries });
    setDraftDirty(true);
  };

  const addExerciseToActiveSession = () => {
    if (!activeSession || !newExerciseId) return;
    const nextEntries = [...activeSession.entries];
    nextEntries.push(makeExerciseDraft(newExerciseId, nextEntries.length + 1));
    setActiveSession({ ...activeSession, entries: normalizeEntries(nextEntries) });
    setDraftDirty(true);
    setNewExerciseId('');
  };

  const removeExercise = (entryIndex) => {
    if (!activeSession) return;
    const nextEntries = activeSession.entries.filter((_, idx) => idx !== entryIndex);
    setActiveSession({ ...activeSession, entries: normalizeEntries(nextEntries) });
    setDraftDirty(true);
  };

  const moveExercise = (entryIndex, direction) => {
    if (!activeSession) return;
    const nextEntries = [...activeSession.entries];
    const targetIndex = entryIndex + direction;
    if (targetIndex < 0 || targetIndex >= nextEntries.length) return;
    [nextEntries[entryIndex], nextEntries[targetIndex]] = [nextEntries[targetIndex], nextEntries[entryIndex]];
    setActiveSession({ ...activeSession, entries: normalizeEntries(nextEntries) });
    setDraftDirty(true);
  };

  const buildEntriesPayload = (sessionDraft) =>
    normalizeEntries(sessionDraft.entries).map((entry, index) => {
      const reps = entry.sets.map((set) => Number(set.reps) || 0).filter((value) => value > 0);
      const fallbackReps = Number(entry.sets?.[0]?.repsPlaceholder || DEFAULT_REPS);
      return {
        exercise: entry.exerciseId,
        order: index + 1,
        plannedSets: entry.sets.length,
        plannedRepsMin: reps.length > 0 ? Math.max(1, Math.min(...reps)) : fallbackReps,
        plannedRepsMax: reps.length > 0 ? Math.max(1, Math.max(...reps)) : fallbackReps,
        plannedWeightKg: Number(entry.sets[0]?.weightKg || 0),
        restSeconds: Number(entry.restSeconds || restSecondsDefault),
        notes: entry.notes || '',
        performedSets: entry.sets
          .filter((set) => set.completed && Number(set.reps) > 0 && Number(set.weightKg) >= 0)
          .map((set) => ({
            setNumber: set.setNumber,
            reps: Number(set.reps),
            weightKg: Number(set.weightKg),
            restSeconds: Number(entry.restSeconds || restSecondsDefault),
            completed: true,
          })),
      };
    });

  const saveDraftSession = async (silent = true) => {
    if (!activeSession?.id) return true;
    try {
      setSavingDraft(true);
      await updateSession(activeSession.id, { entries: buildEntriesPayload(activeSession) });
      setDraftDirty(false);
      return true;
    } catch {
      if (!silent) error('No se pudo guardar el progreso del entreno');
      return false;
    } finally {
      setSavingDraft(false);
    }
  };

  useEffect(() => {
    if (!draftDirty || !activeSession?.id) return undefined;
    const timerId = setTimeout(() => {
      saveDraftSession(true);
    }, 700);
    return () => clearTimeout(timerId);
  }, [draftDirty, activeSession]);

  const handleCloseWorkoutModal = async () => {
    if (draftDirty) {
      await saveDraftSession(false);
    }
    setWorkoutModalOpen(false);
  };

  const getSetCompletionState = useMemo(() => {
    if (!activeSession) return { canFinish: false, pending: 0 };

    let pending = 0;
    activeSession.entries.forEach((entry) => {
      entry.sets.forEach((set) => {
        const done = set.completed && Number(set.reps) > 0 && Number(set.weightKg) > 0;
        if (!done) pending += 1;
      });
    });

    return {
      pending,
      canFinish: activeSession.entries.length > 0 && pending === 0,
    };
  }, [activeSession]);

  const handleFinishSession = async () => {
    if (!activeSession) return;
    if (!getSetCompletionState.canFinish) {
      error('Complete all sets with reps and weight > 0 before finishing');
      return;
    }

    try {
      await updateSession(activeSession.id, { entries: buildEntriesPayload(activeSession) });
      await completeSession(activeSession.id, {});
      await refetch();

      setWorkoutModalOpen(false);
      setActiveSession(null);
      setDraftDirty(false);
      stopRest();
      success('Workout finished');
    } catch {
      error('Failed to finish workout');
    }
  };

  const handleCancelWorkout = async () => {
    if (!activeSession?.id) return;
    if (!window.confirm('Cancelar entreno? Se eliminara la sesion en curso.')) return;
    try {
      await cancelSession(activeSession.id);
      setWorkoutModalOpen(false);
      setActiveSession(null);
      setDraftDirty(false);
      stopRest();
      success('Entreno cancelado');
    } catch {
      error('Failed to cancel workout');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-32">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Workout Sessions</h1>
          <Button onClick={() => setStartModalOpen(true)} disabled={hasInProgressSession}>
            + Start New Session
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} className="h-40" />
              ))}
            </>
          ) : orderedSessions.length > 0 ? (
            orderedSessions.map((session, index) => (
              <Card key={getId(session)}>
                <CardBody className="flex justify-between items-start md:items-center md:flex-row flex-col gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {(session.name || session.routine?.name || 'Sesión libre')} #{orderedSessions.length - index}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getSessionStatusVariant(session.status)}>{session.status}</Badge>
                      <Badge variant="default">{session.entries?.length || 0} exercises</Badge>
                      <Badge variant="default">{new Date(session.startedAt).toLocaleDateString()}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {session.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleResumeSession(getId(session))}
                      >
                        Volver al entreno
                      </Button>
                    )}
                    {session.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleViewSessionDetails(getId(session))}
                      >
                        Ver detalles
                      </Button>
                    )}
                    {session.status === 'completed' && (
                      <Button size="sm" variant="secondary" onClick={() => handleDeleteSession(session)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No sessions yet</p>
              <Button onClick={() => setStartModalOpen(true)}>Start Your First Session</Button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={startModalOpen} onClose={() => setStartModalOpen(false)} title="Start Session" size="lg">
        <div className="space-y-5">
          {hasInProgressSession && (
            <div className="border border-yellow-400/50 bg-yellow-500/20 text-yellow-200 rounded-lg p-3 text-sm font-medium">
              Ya hay una sesion activa. Usa "Volver al entreno" en el listado.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStartMode('empty')}
              className={`text-left border rounded-lg p-4 ${
                startMode === 'empty' ? 'border-[#CCFF00] bg-[#2A2A2A]' : 'border-[#333] bg-[#1E1E1E]'
              }`}
            >
              <p className="text-white font-semibold">Sesion vacia</p>
              <p className="text-sm text-gray-400 mt-1">Empieza sin rutina y anade ejercicios manualmente.</p>
            </button>
            <button
              type="button"
              onClick={() => setStartMode('routine')}
              className={`text-left border rounded-lg p-4 ${
                startMode === 'routine' ? 'border-[#CCFF00] bg-[#2A2A2A]' : 'border-[#333] bg-[#1E1E1E]'
              }`}
            >
              <p className="text-white font-semibold">Sesion desde rutina</p>
              <p className="text-sm text-gray-400 mt-1">Carga ejercicios y orden desde tu rutina base.</p>
            </button>
          </div>

          {startMode === 'empty' && (
            <div>
              <label className="block text-xs uppercase text-gray-400 font-bold mb-2">Nombre de la sesión</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full bg-black border border-[#333] rounded-lg p-3 text-white text-sm outline-none focus:border-[#CCFF00]"
                placeholder="Ej: Día de pecho y tríceps"
              />
            </div>
          )}

          {startMode === 'routine' && (
            <div>
              <label className="block text-xs uppercase text-gray-400 font-bold mb-2">Routine</label>
              <select
                value={selectedRoutineId}
                onChange={(e) => setSelectedRoutineId(e.target.value)}
                className="w-full bg-black border border-[#333] rounded-lg p-3 text-white text-sm outline-none focus:border-[#CCFF00]"
              >
                <option value="">Select routine...</option>
                {routines.map((routine) => (
                  <option key={getId(routine)} value={getId(routine)}>
                    {routine.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStartModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleStartSession}
              disabled={hasInProgressSession || (startMode === 'routine' && !selectedRoutineId) || (startMode === 'empty' && !sessionName)}
            >
              Start Workout
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={workoutModalOpen}
        onClose={handleCloseWorkoutModal}
        title={`${activeSession?.name || 'Workout'} - ${formatSeconds(elapsedSeconds)}`}
        size="xl"
      >
        {!activeSession ? null : (
          <div className="space-y-5">
            {showRestAlert && (
              <div className="border border-yellow-400/50 bg-yellow-500/20 text-yellow-200 rounded-lg p-3 text-sm font-medium">
                Es hora de hacer la serie!
              </div>
            )}

            <div className="flex items-center gap-2">
              <select
                value={newExerciseId}
                onChange={(e) => setNewExerciseId(e.target.value)}
                className="flex-1 bg-black border border-[#333] rounded-lg p-2.5 text-white text-sm outline-none focus:border-[#CCFF00]"
              >
                <option value="">Add exercise...</option>
                {exercises.map((exercise) => (
                  <option key={getId(exercise)} value={getId(exercise)}>
                    {exercise.name}
                  </option>
                ))}
              </select>
              <Button size="sm" onClick={addExerciseToActiveSession} disabled={!newExerciseId} className="flex items-center gap-2">
                <Plus size={16} />
                Add Exercise
              </Button>
            </div>

            <div className="max-h-[58vh] overflow-y-auto pr-1 space-y-4">
              {activeSession.entries.map((entry, entryIndex) => (
                <div key={`${entry.exerciseId}-${entry.order}`} className="border border-[#333] rounded-lg bg-[#181818] p-3">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-white font-semibold">{entry.exerciseName}</p>
                      <p className="text-xs uppercase text-gray-400">
                        {entry.primaryMuscles?.length > 0 ? entry.primaryMuscles.join(', ') : 'No muscles'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="text-gray-500 hover:text-[#CCFF00] disabled:opacity-20"
                        onClick={() => moveExercise(entryIndex, -1)}
                        disabled={entryIndex === 0}
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-[#CCFF00] disabled:opacity-20"
                        onClick={() => moveExercise(entryIndex, 1)}
                        disabled={entryIndex === activeSession.entries.length - 1}
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 ml-1"
                        onClick={() => removeExercise(entryIndex)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-[58px_1fr_1fr_48px] items-center gap-2 mb-2 px-0.5">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Serie</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Peso (kg)</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Repeticiones</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold text-center">OK</span>
                  </div>

                  <div className="space-y-2">
                    {entry.sets.map((set, setIndex) => (
                      <div key={set.setNumber} className="grid grid-cols-[58px_1fr_1fr_48px] items-center gap-2">
                        <span className="text-xs text-gray-400 font-semibold">SET {set.setNumber}</span>
                        <input
                          type="number"
                          min="0"
                          disabled={set.completed}
                          value={getDisplayValue(set.weightKg)}
                          onChange={(e) => updateEntrySetField(entryIndex, setIndex, 'weightKg', e.target.value)}
                          className="bg-black border border-[#333] rounded px-2 py-1.5 text-sm text-white outline-none focus:border-[#CCFF00] disabled:opacity-45"
                          placeholder="0"
                        />
                        <input
                          type="number"
                          min="0"
                          disabled={set.completed}
                          value={getDisplayValue(set.reps)}
                          onChange={(e) => updateEntrySetField(entryIndex, setIndex, 'reps', e.target.value)}
                          className="bg-black border border-[#333] rounded px-2 py-1.5 text-sm text-white outline-none focus:border-[#CCFF00] disabled:opacity-45"
                          placeholder={String(set.repsPlaceholder || DEFAULT_REPS)}
                        />
                        <button
                          disabled={!set.completed && (Number(set.reps) <= 0 || Number(set.weightKg) <= 0)}
                          onClick={() => toggleSetCompleted(entryIndex, setIndex)}
                          className={`h-9 w-9 rounded border flex items-center justify-center transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${
                            set.completed
                              ? 'bg-[#CCFF00] border-[#CCFF00] text-black'
                              : 'border-[#444] text-gray-400 hover:border-[#CCFF00] hover:text-[#CCFF00]'
                          }`}
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => addSetToExercise(entryIndex)}>
                        + Serie
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => removeSetFromExercise(entryIndex)}>
                        - Serie
                      </Button>
                    </div>
                    <span className="text-xs text-gray-400">{entry.sets.length} series</span>
                  </div>
                </div>
              ))}

              {activeSession.entries.length === 0 && (
                <div className="border-2 border-dashed border-[#333] rounded-xl p-8 text-center text-gray-500">
                  Sin ejercicios aun. Anade el primero arriba.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#333]">
              {savingDraft && (
                <p className="text-xs text-gray-400 mb-2 text-center">Guardando cambios...</p>
              )}
              <div className="mb-2 text-center">
                <p className="text-[11px] uppercase text-gray-500 font-bold">Descanso restante</p>
                <p className="text-lg font-semibold text-white">
                  {restRunning ? formatSeconds(restRemaining) : '00:00'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button variant="secondary" className="w-full" onClick={handleCancelWorkout}>
                  Cancelar entreno
                </Button>
                <Button className="w-full" onClick={handleFinishSession} disabled={!getSetCompletionState.canFinish}>
                  Terminar entreno
                </Button>
              </div>
              {!getSetCompletionState.canFinish && (
                <p className="text-xs text-red-400 mt-2 text-center">
                  Faltan {getSetCompletionState.pending} series por completar.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={sessionDetailsModalOpen}
        onClose={() => setSessionDetailsModalOpen(false)}
        title={sessionDetails?.name || sessionDetails?.routine?.name || 'Detalles del entreno'}
        size="lg"
      >
        {!sessionDetails ? null : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#121212] border border-[#333] rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Estado</p>
                <p className="text-sm text-white font-semibold">{sessionDetails.status}</p>
              </div>
              <div className="bg-[#121212] border border-[#333] rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Fecha</p>
                <p className="text-sm text-white font-semibold">
                  {new Date(sessionDetails.startedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-3">
              {(sessionDetails.entries || []).map((entry, index) => (
                <div key={`${getId(entry)}-${index}`} className="bg-[#121212] border border-[#333] rounded-lg p-3">
                  <p className="text-white font-semibold">{entry.exercise?.name || 'Unknown Exercise'}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    {entry.performedSets?.length || 0} series realizadas
                  </p>
                  <div className="space-y-1">
                    {(entry.performedSets || []).map((set) => (
                      <div key={`${set.setNumber}-${set.reps}-${set.weightKg}`} className="text-xs text-gray-300">
                        Set {set.setNumber}: {set.weightKg} kg x {set.reps} reps
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

    </MainLayout>
  );
}
