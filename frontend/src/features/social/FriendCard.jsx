import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function FriendCard({ friend, onRemove, onViewWorkouts, isRemoving }) {
  return (
    <Card className="hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200">
      <CardHeader>
        <CardTitle className="truncate">
          {friend.firstName} {friend.lastName}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          <p className="text-[#CCFF00] text-sm font-medium">@{friend.username}</p>
          {friend.experience && (
            <p className="text-gray-400 text-xs">Experience: <span className="text-gray-300 capitalize">{friend.experience}</span></p>
          )}
          {friend.objective && (
            <p className="text-gray-400 text-xs">Goal: <span className="text-gray-300 capitalize">{friend.objective}</span></p>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex gap-2 border-t border-[#333] pt-4">
        <Button
          size="sm"
          variant="secondary"
          className="flex-1 text-xs"
          onClick={() => onViewWorkouts(friend)}
        >
          🏋️ Workouts
        </Button>
        <Button
          size="sm"
          variant="danger"
          className="text-xs px-3"
          onClick={() => onRemove(friend._id || friend.id)}
          disabled={isRemoving}
        >
          {isRemoving ? '⏳' : '❌ Remove'}
        </Button>
      </CardFooter>
    </Card>
  );
}