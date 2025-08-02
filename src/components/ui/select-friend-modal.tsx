import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Friend {
  id: string;
  username: string;
  email: string;
  isOnline?: boolean;
  lastActive?: string;
  hasActiveChat?: boolean;
}

interface SelectFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFriend: (friend: Friend) => void;
  isLoading?: boolean;
}

export function SelectFriendModal({
  isOpen,
  onClose,
  onSelectFriend,
  isLoading = false
}: SelectFriendModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [allFriends, setAllFriends] = useState<Friend[]>([]); // Track all friends for stats
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Load friends when modal opens
  useEffect(() => {
    if (isOpen) {
      loadFriends();
    }
  }, [isOpen]);

  // Filter friends based on search term
  useEffect(() => {
    const filtered = friends.filter(friend =>
      friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(filtered);
  }, [searchTerm, friends]);

  const loadFriends = async () => {
    setLoadingFriends(true);
    try {
      // Mock friends data for now - will be replaced with actual API
      const mockFriends: Friend[] = [
        {
          id: 'friend-1',
          username: 'john_doe',
          email: 'john@example.com',
          isOnline: true,
          hasActiveChat: false
        },
        {
          id: 'friend-2',
          username: 'alice_smith',
          email: 'alice@example.com',
          isOnline: false,
          lastActive: '2 hours ago',
          hasActiveChat: true // This friend already has an active chat
        },
        {
          id: 'friend-3',
          username: 'bob_wilson',
          email: 'bob@example.com',
          isOnline: true,
          hasActiveChat: false
        },
        {
          id: 'friend-4',
          username: 'sarah_jones',
          email: 'sarah@example.com',
          isOnline: false,
          lastActive: '1 day ago',
          hasActiveChat: false
        },
        {
          id: 'friend-5',
          username: 'mike_chen',
          email: 'mike@example.com',
          isOnline: false,
          lastActive: '3 days ago',
          hasActiveChat: false
        }
      ];

      // Filter out friends who already have active chats
      const availableFriends = mockFriends.filter(friend => !friend.hasActiveChat);
      setAllFriends(mockFriends);
      setFriends(availableFriends);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleSelectFriend = (friend: Friend) => {
    onSelectFriend(friend);
    setSearchTerm("");
    onClose();
  };

  const getStatusText = (friend: Friend) => {
    if (friend.isOnline) return "Online";
    if (friend.lastActive) return `Last seen ${friend.lastActive}`;
    return "Offline";
  };

  const getStatusColor = (friend: Friend) => {
    return friend.isOnline ? "text-green-400" : "text-gray-400";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span>Start New Chat</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select a friend to start a new conversation
            {allFriends.length > 0 && (
              <span className="block text-xs mt-1">
                {friends.length} of {allFriends.length} friends available for new chats
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Friends List */}
        <ScrollArea className="max-h-64">
          {loadingFriends ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                {searchTerm 
                  ? 'No friends found matching your search.' 
                  : friends.length === 0 
                    ? 'No friends available for new chats.'
                    : 'All your friends already have active chats.'
                }
              </p>
              {friends.length === 0 && searchTerm === '' && (
                <div className="mt-3">
                  <p className="text-gray-500 text-xs mb-2">
                    You need friends to start user chats.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/users', '_blank')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Find Friends
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFriends.map((friend) => (
                <Button
                  key={friend.id}
                  variant="ghost"
                  className="w-full p-3 h-auto justify-start hover:bg-gray-700/50 transition-colors"
                  onClick={() => handleSelectFriend(friend)}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {friend.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-200">@{friend.username}</p>
                      <p className={`text-xs ${getStatusColor(friend)}`}>
                        {getStatusText(friend)}
                      </p>
                    </div>
                    
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
