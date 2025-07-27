import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, Crown, Edit3, Key, User, Verified } from "lucide-react";

interface ProfileTabProps {
  user: any;
  authLoading: boolean;
  loading: boolean;
  stats: {
    memberSince: string;
    passwordLastChanged?: string;
  } | null;
  onEditProfile: () => void;
  onChangePlan: () => void;
}

export function ProfileTab({
  user,
  authLoading,
  loading,
  stats,
  onEditProfile,
  onChangePlan
}: ProfileTabProps) {
  return (
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
            onClick={onEditProfile}
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
              onClick={onChangePlan}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Change Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
