import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useState, useMemo } from 'react';
import { useSocial } from '../../hooks/useSocial';
import { useToast } from '../../context/ToastContext';

// Importamos nuestros sub-componentes (FriendCard y FriendWorkoutsModal se mantienen igual)
import FriendCard from './FriendCard';
import FriendWorkoutsModal from './FriendWorkoutsModal';

export default function SocialPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newFriendUsername, setNewFriendUsername] = useState(''); // Cambiado a Username

  const [selectedFriend, setSelectedFriend] = useState(null);

  const { friends, loading, operationLoading, addFriend, removeFriend, getFriendWorkouts } = useSocial();
  const { success, error } = useToast();

  const filteredFriends = useMemo(() => {
    if (!searchQuery) return friends;
    const q = searchQuery.toLowerCase();
    return friends.filter(f =>
      f.firstName?.toLowerCase().includes(q) ||
      f.lastName?.toLowerCase().includes(q) ||
      f.username?.toLowerCase().includes(q)
    );
  }, [friends, searchQuery]);

  const handleAddFriend = async (e) => {
    e.preventDefault();

    // Limpiamos el input por si el usuario le pone una arroba por costumbre (ej: @juan)
    const cleanUsername = newFriendUsername.trim().replace(/^@/, '');

    if (!cleanUsername) return;

    try {
      await addFriend(cleanUsername);
      success('Friend added successfully!');
      setNewFriendUsername(''); // Limpiamos el input al tener éxito
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add friend. Check the username.');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        await removeFriend(friendId);
        success('Friend removed');
        if (selectedFriend && (selectedFriend._id || selectedFriend.id) === friendId) {
          setSelectedFriend(null);
        }
      } catch (err) {
        error(err.response?.data?.message || 'Failed to remove friend');
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-6xl mx-auto">

        {/* Header y Add Friend Section */}
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#333] shadow-md">
          <h1 className="text-3xl font-bold text-white mb-2">👥 Social</h1>
          <p className="text-gray-400 text-sm mb-6">Connect with others and track their progress.</p>

          <form onSubmit={handleAddFriend} className="flex gap-2 max-w-md">
            <Input
              placeholder="Enter Friend's Username (e.g. johndoe)"
              value={newFriendUsername}
              onChange={(e) => setNewFriendUsername(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-[#CCFF00] text-black whitespace-nowrap"
              disabled={!newFriendUsername.trim() || operationLoading.add}
            >
              {operationLoading.add ? '⏳ Adding...' : '➕ Add Friend'}
            </Button>
          </form>
        </div>

        {/* My Friends List Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">My Friends ({friends.length})</h2>
            <div className="w-64">
              <Input
                placeholder="🔍 Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : filteredFriends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFriends.map((friend) => (
                <FriendCard
                  key={friend._id || friend.id}
                  friend={friend}
                  isRemoving={operationLoading.remove[friend._id || friend.id]}
                  onRemove={handleRemoveFriend}
                  onViewWorkouts={(f) => setSelectedFriend(f)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#111] rounded-lg border border-[#222]">
              <p className="text-6xl mb-4">🕵️</p>
              <h3 className="text-xl font-bold text-white mb-2">No friends found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Add some friends by their username to see them here!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <FriendWorkoutsModal
        isOpen={!!selectedFriend}
        onClose={() => setSelectedFriend(null)}
        friend={selectedFriend}
        fetchWorkouts={getFriendWorkouts}
      />
    </MainLayout>
  );
}