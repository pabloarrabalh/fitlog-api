import MainLayout from '../../components/layout/MainLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useSessions } from '../../hooks/useSessions';
import { useToast } from '../../context/ToastContext';

export default function SessionsPage() {
  const { sessions, loading, deleteSession, completeSession } = useSessions();
  const { success, error } = useToast();

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Delete this session?')) {
      try {
        await deleteSession(sessionId);
        success('Session deleted');
      } catch {
        error('Failed to delete session');
      }
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      await completeSession(sessionId, {});
      success('Session completed!');
    } catch {
      error('Failed to complete session');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Workout Sessions</h1>
          <Button>+ Start New Session</Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} className="h-40" />
              ))}
            </>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <Card key={session._id}>
                <CardBody className="flex justify-between items-start md:items-center md:flex-row flex-col gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {session.routine?.name || 'Ad-hoc Session'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                      <Badge variant="default">
                        {session.exercises?.length || 0} exercises
                      </Badge>
                      <Badge variant="default">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {session.status === 'active' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCompleteSession(session._id)}
                      >
                        Complete
                      </Button>
                    )}
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteSession(session._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No sessions yet</p>
              <Button>Start Your First Session</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
