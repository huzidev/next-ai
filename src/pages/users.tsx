import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Ban, ChevronDown, MessageSquare, Search, User, UserPlus, Users, X } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isBan: boolean;
  planName: string;
  remainingTries: number;
  lastActiveAt: string | null;
  friendshipStatus?: 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'blocked';
}

interface FriendshipData {
  [userId: string]: 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'blocked';
}

export default function UsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [friendships, setFriendships] = useState<FriendshipData>({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth/user/signin');
          return;
        }

        // Check if user is admin
        try {
          const adminResponse = await fetch('/api/admin/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (adminResponse.ok) {
            setIsAdmin(true);
          }
        } catch (adminError) {
          // User is not admin, continue as regular user
          setIsAdmin(false);
        }

        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
          setFilteredUsers(data.users);

          // Load friendship statuses if not admin
          if (!isAdmin && user?.id) {
            try {
              // First load from localStorage
              const localKey = `friendships_${user.id}`;
              const localFriendships = JSON.parse(localStorage.getItem(localKey) || '{}');
              setFriendships(localFriendships);
              
              // Then try to load from API (will merge with localStorage data)
              const friendshipsResponse = await fetch('/api/friends/status', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const friendshipsData = await friendshipsResponse.json();
              if (friendshipsData.success) {
                setFriendships(prev => ({ ...prev, ...friendshipsData.friendships }));
              }
            } catch (friendshipError) {
              console.error('Error loading friendships:', friendshipError);
            }
          }
        } else {
          throw new Error(data.error || 'Failed to load users');
        }
      } catch (error) {
        console.error('Error loading users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUsers();
    }
  }, [router, toast, user, isAdmin]);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(userData => 
      userData.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: userId })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setFriendships(prev => ({ ...prev, [userId]: 'pending_sent' }));
        
        // Persist to localStorage for now (until database is working)
        const currentUserId = user?.id;
        if (currentUserId) {
          const key = `friendships_${currentUserId}`;
          const existingFriendships = JSON.parse(localStorage.getItem(key) || '{}');
          existingFriendships[userId] = 'pending_sent';
          localStorage.setItem(key, JSON.stringify(existingFriendships));
        }
        
        toast({
          title: "Friend Request Sent",
          description: "Your friend request has been sent successfully."
        });
      } else {
        throw new Error(data.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const acceptFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/friends/accept-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId: userId })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setFriendships(prev => ({ ...prev, [userId]: 'accepted' }));
        
        // Persist to localStorage
        const currentUserId = user?.id;
        if (currentUserId) {
          const key = `friendships_${currentUserId}`;
          const existingFriendships = JSON.parse(localStorage.getItem(key) || '{}');
          existingFriendships[userId] = 'accepted';
          localStorage.setItem(key, JSON.stringify(existingFriendships));
        }
        
        toast({
          title: "Friend Request Accepted",
          description: "You are now friends! You can start chatting."
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

  const declineFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/friends/decline-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId: userId })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setFriendships(prev => ({ ...prev, [userId]: 'none' }));
        
        // Persist to localStorage
        const currentUserId = user?.id;
        if (currentUserId) {
          const key = `friendships_${currentUserId}`;
          const existingFriendships = JSON.parse(localStorage.getItem(key) || '{}');
          existingFriendships[userId] = 'none';
          localStorage.setItem(key, JSON.stringify(existingFriendships));
        }
        
        toast({
          title: "Friend Request Declined",
          description: "The friend request has been declined.",
          variant: "destructive"
        });
      } else {
        throw new Error(data.error || 'Failed to decline friend request');
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast({
        title: "Error",
        description: "Failed to decline friend request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openChat = (targetUser: UserData) => {
    const friendshipStatus = friendships[targetUser.id] || 'none';
    
    if (friendshipStatus === 'accepted') {
      // Open chat with friend
      router.push(`/chat/${targetUser.id}`);
    } else if (friendshipStatus === 'pending_sent') {
      toast({
        title: "Request Pending",
        description: `${targetUser.username} hasn't accepted your friend request yet.`,
        variant: "default"
      });
    } else if (friendshipStatus === 'pending_received') {
      toast({
        title: "Friend Request",
        description: `Accept ${targetUser.username}'s friend request to start chatting.`,
        variant: "default"
      });
    } else {
      toast({
        title: "Not Friends",
        description: `${targetUser.username} is not your friend. Send a friend request first.`,
        variant: "default"
      });
    }
  };

  const getChatButtonIcon = (userId: string) => {
    const status = friendships[userId] || 'none';
    return status === 'accepted' ? MessageSquare : Ban;
  };

  const isChatDisabled = (userId: string) => {
    const status = friendships[userId] || 'none';
    return status !== 'accepted';
  };

  const getChatTooltipText = (userId: string) => {
    const status = friendships[userId] || 'none';
    switch (status) {
      case 'pending_sent':
        return 'Chat disabled - Friend request pending';
      case 'pending_received':
        return 'Chat disabled - Accept friend request to chat';
      case 'blocked':
        return 'Chat disabled - User is blocked';
      case 'none':
        return 'Chat disabled - Send friend request to chat';
      default:
        return 'Chat unavailable';
    }
  };

  const getFriendButtonText = (userId: string) => {
    const status = friendships[userId] || 'none';
    switch (status) {
      case 'pending_sent':
        return 'Request Sent';
      case 'pending_received':
        return 'Accept Request';
      case 'accepted':
        return 'Friends';
      case 'blocked':
        return 'Blocked';
      default:
        return 'Add Friend';
    }
  };

  const getFriendButtonVariant = (userId: string) => {
    const status = friendships[userId] || 'none';
    switch (status) {
      case 'pending_sent':
        return 'secondary';
      case 'pending_received':
        return 'default';
      case 'accepted':
        return 'outline';
      case 'blocked':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Head>
        <title>All Users - Next-AI</title>
        <meta name="description" content="View all registered users" />
      </Head>

      <TooltipProvider>
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
                <h1 className="text-3xl font-bold text-white">All Users</h1>
                <p className="text-gray-400">View all registered users</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="h-5 w-5" />
                <span>{filteredUsers.length} users</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/friends')}
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                View Friend Requests
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Users
              </CardTitle>
              <CardDescription className="text-gray-400">
                Search by username or email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Users List</CardTitle>
              <CardDescription className="text-gray-400">
                All registered users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">User</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        {isAdmin && <TableHead className="text-gray-300">Plan</TableHead>}
                        {isAdmin && <TableHead className="text-gray-300">Credits</TableHead>}
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Last Active</TableHead>
                        <TableHead className="text-gray-300">Joined</TableHead>
                        {!isAdmin && <TableHead className="text-gray-300">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((userData) => (
                        <TableRow key={userData.id} className="border-gray-700">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-600 text-white text-sm">
                                  {userData.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white font-medium">{userData.username}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{userData.email}</TableCell>
                          {isAdmin && (
                            <TableCell>
                              <Badge variant="outline" className="text-blue-400 border-blue-400">
                                {userData.planName}
                              </Badge>
                            </TableCell>
                          )}
                          {isAdmin && (
                            <TableCell>
                              <span className={`font-medium ${
                                userData.remainingTries < 10 ? 'text-red-400' : 
                                userData.remainingTries < 20 ? 'text-yellow-400' : 
                                'text-green-400'
                              }`}>
                                {userData.remainingTries}
                              </span>
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="flex space-x-1">
                              <Badge 
                                variant={userData.isVerified ? "default" : "secondary"}
                                className={userData.isVerified ? "bg-green-600" : "bg-gray-600"}
                              >
                                {userData.isVerified ? "Verified" : "Unverified"}
                              </Badge>
                              {userData.isBan && (
                                <Badge variant="destructive">Banned</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {getLastActiveText(userData.lastActiveAt)}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {formatDate(userData.createdAt)}
                          </TableCell>
                          {!isAdmin && userData.id !== user?.id && (
                            <TableCell>
                              <div className="flex space-x-2">
                                {friendships[userData.id] === 'pending_received' ? (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="default"
                                        className="text-xs"
                                      >
                                        <UserPlus className="h-3 w-3 mr-1" />
                                        Accept Request
                                        <ChevronDown className="h-3 w-3 ml-1" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem 
                                        onClick={() => acceptFriendRequest(userData.id)}
                                        className="text-green-600 focus:text-green-600"
                                      >
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Accept Request
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => declineFriendRequest(userData.id)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Decline Request
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant={getFriendButtonVariant(userData.id) as any}
                                    onClick={() => sendFriendRequest(userData.id)}
                                    disabled={friendships[userData.id] === 'pending_sent' || friendships[userData.id] === 'blocked'}
                                    className="text-xs"
                                  >
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    {getFriendButtonText(userData.id)}
                                  </Button>
                                )}
                                {isChatDisabled(userData.id) ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => openChat(userData)}
                                        disabled={true}
                                        className="text-xs opacity-50 cursor-not-allowed"
                                      >
                                        {(() => {
                                          const IconComponent = getChatButtonIcon(userData.id);
                                          return <IconComponent className="h-3 w-3 mr-1" />;
                                        })()}
                                        Chat
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{getChatTooltipText(userData.id)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openChat(userData)}
                                    disabled={false}
                                    className="text-xs"
                                  >
                                    {(() => {
                                      const IconComponent = getChatButtonIcon(userData.id);
                                      return <IconComponent className="h-3 w-3 mr-1" />;
                                    })()}
                                    Chat
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
      </TooltipProvider>
    </>
  );
}
