import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Clock, Key, Settings, User } from "lucide-react";

interface AccountTabProps {
  user: any;
  stats: {
    passwordLastChanged?: string;
  } | null;
  onChangePassword: () => void;
  onUpdateProfile: () => void;
  onAccountActivity: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
}

export function AccountTab({
  user,
  stats,
  onChangePassword,
  onUpdateProfile,
  onAccountActivity,
  onDeleteAccount,
  onLogout
}: AccountTabProps) {
  return (
    <div className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={onChangePassword}
              className="justify-start border-gray-600 text-gray-200 hover:bg-gray-700 h-20 p-0 overflow-hidden"
            >
              <div className="flex items-center w-full h-full px-6 py-4">
                <Key className="h-6 w-6 mr-4 text-blue-400 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-base truncate">Change Password</div>
                  {stats?.passwordLastChanged && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      Last changed: {stats.passwordLastChanged}
                    </div>
                  )}
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onUpdateProfile}
              className="justify-start border-gray-600 text-gray-200 hover:bg-gray-700 h-20 p-0 overflow-hidden"
            >
              <div className="flex items-center w-full h-full px-6 py-4">
                <User className="h-6 w-6 mr-4 text-green-400 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-base truncate">Update Profile</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    Edit username and email
                  </div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onAccountActivity}
              className="justify-start border-gray-600 text-gray-200 hover:bg-gray-700 h-20 p-0 overflow-hidden"
            >
              <div className="flex items-center w-full h-full px-6 py-4">
                <Clock className="h-6 w-6 mr-4 text-purple-400 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-base truncate">Account Activity</div>
                  {user?.lastActiveAt ? (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      Last active: {new Date(user.lastActiveAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      View recent account activity
                    </div>
                  )}
                </div>
              </div>
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={onLogout}
              className="justify-start h-20 p-0 overflow-hidden"
            >
              <div className="flex items-center w-full h-full px-6 py-4">
                <ArrowLeft className="h-6 w-6 mr-4 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-base truncate">Sign Out</div>
                  <div className="text-xs opacity-75 mt-1 truncate">
                    Log out of your account
                  </div>
                </div>
              </div>
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
          <Button 
            variant="destructive" 
            onClick={onDeleteAccount}
            className="justify-start h-20 p-0 w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center w-full h-full px-6 py-4">
              <AlertTriangle className="h-6 w-6 mr-4 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-base truncate">Delete Account</div>
                <div className="text-xs opacity-75 mt-1 truncate">
                  Permanently delete your account and all data
                </div>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
