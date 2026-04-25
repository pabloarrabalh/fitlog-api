import MainLayout from '../../components/layout/MainLayout';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import Input from '../../components/ui/Input';
import { useState } from 'react';
import { useSocial } from '../../hooks/useSocial';
import { useToast } from '../../context/ToastContext';

export default function SocialPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { friends, loading, addFriend, removeFriend } = useSocial();
  const { success, error } = useToast();

  const handleAddFriend = async (friendId) => {
    try {
      await addFriend(friendId);
      success('Friend added!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add friend');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm('Remove this friend?')) {
      try {
        await removeFriend(friendId);
        success('Friend removed');
      } catch {
        error('Failed to remove friend');
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Friends</h1>
          <Input
            placeholder="Search for friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <Card key={friend._id}>
                <CardHeader>
                  <CardTitle>
                    {friend.firstName} {friend.lastName}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-400 text-sm mb-2">@{friend.username}</p>
                  {friend.objective && (
                    <p className="text-gray-400 text-sm">Goal: {friend.objective}</p>
                  )}
                </CardBody>
                <CardFooter className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRemoveFriend(friend._id)}
                  >
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No friends yet</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
