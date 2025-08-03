import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Clock, MessageSquare, Search, UserCheck, Users, UserX } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Friend {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  lastActiveAt: string | null;
  status: 'accepted' | 'pending_sent' | 'pending_received' | 'blocked';
  friendshipId: string;
}

export default function FriendsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'requests'>('friends');

  // Load friends
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth/user/signin');
          return;
        }

        const response = await fetch('/api/friends/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setFriends(data.friends);
          setFilteredFriends(data.friends);
        } else {
          throw new Error(data.error || 'Failed to load friends');
        }
      } catch (error) {
        console.error('Error loading friends:', error);
        toast({
          title: "Error",
          description: "Failed to load friends. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadFriends();
    }
  }, [router, toast, user]);

  // Filter friends based on search term and active tab
  useEffect(() => {
    let filtered = friends.filter(friend => 
      friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by tab
    switch (activeTab) {
      case 'friends':
        filtered = filtered.filter(friend => friend.status === 'accepted');
        break;
      case 'pending':
        filtered = filtered.filter(friend => friend.status === 'pending_sent');
        break;
      case 'requests':
        filtered = filtered.filter(friend => friend.status === 'pending_received');
        break;
    }

    setFilteredFriends(filtered);
  }, [searchTerm, friends, activeTab]);

  const getLastActiveText = (lastActiveAt: string | null) => {
    if (!lastActiveAt) return 'Never';
    
    const lastActive = new Date(lastActiveAt);
    const now = new Date();
    const diffInMs = now.getTime() - lastActive.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const acceptFriendRequest = async (friendshipId: string, friendId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ friendshipId })
      });

      const data = await response.json();

      if (data.success) {
        setFriends(prev => prev.map(friend => 
          friend.id === friendId ? { ...friend, status: 'accepted' as const } : friend
        ));
        toast({
          title: "Friend Request Accepted",
          description: "You are now friends!"
        });
      } else {
        throw new Error(data.error || 'Failed to accept friend request');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const rejectFriendRequest = async (friendshipId: string, friendId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ friendshipId })
      });

      const data = await response.json();

      if (data.success) {
        setFriends(prev => prev.filter(friend => friend.id !== friendId));
        toast({
          title: "Friend Request Rejected",
          description: "The friend request has been rejected."
        });
      } else {
        throw new Error(data.error || 'Failed to reject friend request');
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to reject friend request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openChat = (friend: Friend) => {
    if (friend.status === 'accepted') {
      router.push(`/chat/${friend.id}`);
    } else {
      toast({
        title: "Cannot Start Chat",
        description: "You can only chat with accepted friends.",
        variant: "default"
      });
    }
  };

  const getTabCounts = () => {
    const friendsCount = friends.filter(f => f.status === 'accepted').length;
    const pendingCount = friends.filter(f => f.status === 'pending_sent').length;
    const requestsCount = friends.filter(f => f.status === 'pending_received').length;
    
    return { friendsCount, pendingCount, requestsCount };
  };

  const { friendsCount, pendingCount, requestsCount } = getTabCounts();

  return (
    <>
      <Head>
        <title>Friends - Next-AI</title>
        <meta name="description" content="Manage your friends and friend requests" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="default"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-3"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Friends</h1>
                <p className="text-gray-400">Manage your friends and friend requests</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="h-5 w-5" />
              <span>{friendsCount} friends</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            <Button
              variant={activeTab === 'friends' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('friends')}
              className="flex items-center space-x-2"
            >
              <UserCheck className="h-4 w-4" />
              <span>Friends ({friendsCount})</span>
            </Button>
            <Button
              variant={activeTab === 'pending' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('pending')}
              className="flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>Pending ({pendingCount})</span>
            </Button>
            <Button
              variant={activeTab === 'requests' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('requests')}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Requests ({requestsCount})</span>
            </Button>
          </div>

          {/* Search */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search {activeTab === 'friends' ? 'Friends' : activeTab === 'pending' ? 'Pending Requests' : 'Friend Requests'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Search by username or email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </CardContent>
          </Card>

          {/* Friends List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {activeTab === 'friends' ? 'Your Friends' : 
                 activeTab === 'pending' ? 'Pending Requests' : 'Friend Requests'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {activeTab === 'friends' ? 'Friends you can chat with' : 
                 activeTab === 'pending' ? 'Requests you sent waiting for acceptance' : 'Requests from other users'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading friends...</p>
                </div>
              ) : filteredFriends.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchTerm ? 'No friends found matching your search.' : 
                     activeTab === 'friends' ? 'No friends yet. Start by adding some friends!' :
                     activeTab === 'pending' ? 'No pending requests.' : 'No friend requests.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {friend.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-medium">{friend.username}</h3>
                            {friend.isVerified && (
                              <Badge variant="default" className="bg-green-600">Verified</Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{friend.email}</p>
                          <p className="text-gray-500 text-xs">Last active: {getLastActiveText(friend.lastActiveAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {friend.status === 'accepted' && (
                          <Button
                            size="sm"
                            onClick={() => openChat(friend)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        )}
                        {friend.status === 'pending_received' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => acceptFriendRequest(friend.friendshipId, friend.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectFriendRequest(friend.friendshipId, friend.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </>
                        )}
                        {friend.status === 'pending_sent' && (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </>
  );
}
