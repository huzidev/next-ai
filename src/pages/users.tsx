import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Search, User, Users } from "lucide-react";
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
}

export default function UsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth/user/signin');
          return;
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

    loadUsers();
  }, [router, toast]);

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

  return (
    <>
      <Head>
        <title>All Users - Next-AI</title>
        <meta name="description" content="View all registered users" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">All Users</h1>
                <p className="text-gray-400">View all registered users (excluding admins)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="h-5 w-5" />
              <span>{filteredUsers.length} users</span>
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
                        <TableHead className="text-gray-300">Plan</TableHead>
                        <TableHead className="text-gray-300">Credits</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Last Active</TableHead>
                        <TableHead className="text-gray-300">Joined</TableHead>
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
                          <TableCell>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              {userData.planName}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              userData.remainingTries < 10 ? 'text-red-400' : 
                              userData.remainingTries < 20 ? 'text-yellow-400' : 
                              'text-green-400'
                            }`}>
                              {userData.remainingTries}
                            </span>
                          </TableCell>
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
    </>
  );
}
