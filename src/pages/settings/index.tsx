import { RouteGuard } from "@/components/auth/RouteGuard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserUsageStatsShadcn } from "@/components/ui/user-usage-stats-shadcn";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, ArrowLeft, Calendar, Clock, CreditCard, Crown, Edit3, Key, Settings, User, Verified } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface UserStats {
  totalChatSessions: number;
  totalMessages: number;
  remainingTries: number;
  planName: string;
  memberSince: string;
  passwordLastChanged?: string;
}

export default function UserSettings() {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug user data
  console.log("SW Settings user data:", user);
  console.log("SW Settings isAuthenticated:", isAuthenticated);
  console.log("SW Settings authLoading:", authLoading);

  useEffect(() => {
    if (user && !authLoading) {
      setStats({
        totalChatSessions: user._count?.chatSessions || 0,
        totalMessages: 0, // We'll calculate this from sessions
        remainingTries: user.remainingTries,
        planName: user.plan?.name || 'Free',
        memberSince: new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        passwordLastChanged: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : undefined
      });
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    // Navigate to edit profile page or open modal
    console.log('Edit profile');
  };

  const handleChangePlan = () => {
    router.push('/plans');
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
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg px-3 py-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="border-l-4 border-blue-500 pl-6">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
          </div>

          {/* Low Credits Warning */}
          {user && user.remainingTries < 20 && (
            <Card className="bg-orange-900/20 border-orange-700 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-orange-400">Plan About to Expire</h3>
                    <p className="text-orange-300 mb-3">
                      You have only {user.remainingTries} credits remaining. Please change your plan to continue using our services.
                    </p>
                    <Button 
                      onClick={handleChangePlan}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-3/4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-400" />
                      <div>
                        <CardTitle className="text-white">Profile Information</CardTitle>
                        <CardDescription className="text-gray-400">
                          Your account details and verification status
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleEditProfile}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl bg-blue-600 text-white">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold text-white">
                          {authLoading ? "Loading..." : (user?.username || 'Unknown User')}
                        </h3>
                        {user?.isVerified && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            <Verified className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400">{authLoading ? "Loading..." : user?.email}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Member since {loading ? "..." : stats?.memberSince}
                      </div>
                      {stats?.passwordLastChanged && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Key className="h-4 w-4 mr-1" />
                          Password last changed {stats.passwordLastChanged}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Plan Section */}
                  <div className="border-t border-gray-700 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Crown className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">Current Plan</h4>
                          <p className="text-gray-400">
                            {user?.plan?.name ? user.plan.name.charAt(0).toUpperCase() + user.plan.name.slice(1) : 'Free'} Plan
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">
                              {user?.remainingTries} credits remaining
                            </span>
                            {user?.plan?.price !== undefined && (
                              <span className="text-sm text-gray-500">
                                ${user.plan.price}/month
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={handleChangePlan}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Change Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="space-y-6">
              <UserUsageStatsShadcn />
            </TabsContent>

            {/* Plans Tab */}
            <TabsContent value="plans" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-blue-400" />
                    Subscription Plans
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose the perfect plan for your needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Free Plan Preview */}
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-700/30">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-1 bg-gray-500/20 rounded">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <h4 className="font-semibold text-white">Free</h4>
                      </div>
                      <p className="text-2xl font-bold text-white mb-2">$0<span className="text-sm text-gray-400">/month</span></p>
                      <p className="text-sm text-gray-400 mb-3">50 AI conversations</p>
                      <Badge variant="outline" className="text-xs">Most Popular</Badge>
                    </div>

                    {/* Pro Plan Preview */}
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-700/30">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-1 bg-blue-500/20 rounded">
                          <Crown className="h-4 w-4 text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-white">Pro</h4>
                      </div>
                      <p className="text-2xl font-bold text-white mb-2">$9.99<span className="text-sm text-gray-400">/month</span></p>
                      <p className="text-sm text-gray-400 mb-3">500 AI conversations</p>
                      <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">Recommended</Badge>
                    </div>

                    {/* Premium Plan Preview */}
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-700/30">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-1 bg-purple-500/20 rounded">
                          <Crown className="h-4 w-4 text-purple-400" />
                        </div>
                        <h4 className="font-semibold text-white">Premium</h4>
                      </div>
                      <p className="text-2xl font-bold text-white mb-2">$19.99<span className="text-sm text-gray-400">/month</span></p>
                      <p className="text-sm text-gray-400 mb-3">Unlimited conversations</p>
                      <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">Best Value</Badge>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <Button 
                      onClick={handleChangePlan}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View All Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-400" />
                    Account Management
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account settings and security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                      {stats?.passwordLastChanged && (
                        <span className="ml-auto text-xs text-gray-500">
                          Last changed: {stats.passwordLastChanged}
                        </span>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700">
                      <User className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700">
                      <Clock className="h-4 w-4 mr-2" />
                      Account Activity
                      {user?.lastActiveAt && (
                        <span className="ml-auto text-xs text-gray-500">
                          Last active: {new Date(user.lastActiveAt).toLocaleDateString()}
                        </span>
                      )}
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
                  <CardTitle className="text-red-400 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Danger Zone
                  </CardTitle>
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
