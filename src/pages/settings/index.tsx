import { RouteGuard } from "@/components/auth/RouteGuard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Calendar, CreditCard, MessageSquare, Settings, User, Verified } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface UserStats {
  totalChatSessions: number;
  totalMessages: number;
  remainingTries: number;
  planName: string;
  memberSince: string;
}

export default function UserSettings() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setStats({
        totalChatSessions: user._count?.chatSessions || 0,
        totalMessages: 0, // We'll calculate this from sessions
        remainingTries: user.remainingTries,
        planName: user.plan?.name || 'Free',
        memberSince: new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
      setLoading(false);
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400">Manage your account and preferences</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-1/2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your account details and verification status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold text-white">
                          {user?.username || 'Loading...'}
                        </h3>
                        {user?.isVerified && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            <Verified className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400">{user?.email}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Member since {stats?.memberSince}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Total Chat Sessions
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {loading ? '...' : stats?.totalChatSessions}
                    </div>
                    <p className="text-xs text-gray-500">
                      All time conversations
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Remaining Tries
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {loading ? '...' : stats?.remainingTries}
                    </div>
                    <p className="text-xs text-gray-500">
                      Messages available
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Current Plan
                    </CardTitle>
                    <Settings className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white capitalize">
                      {loading ? '...' : stats?.planName}
                    </div>
                    <p className="text-xs text-gray-500">
                      Subscription tier
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Usage Statistics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your activity overview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Last Active</span>
                    <span className="text-white">
                      {user?.lastActiveAt ? formatDate(user.lastActiveAt) : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Account Created</span>
                    <span className="text-white">
                      {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Account Status</span>
                    <Badge variant={user?.isVerified ? "default" : "destructive"}>
                      {user?.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Account Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account settings and security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700">
                      <User className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={logout}
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-700">
                <CardHeader>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                  <CardDescription className="text-gray-400">
                    Irreversible actions that affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RouteGuard>
  );
}
