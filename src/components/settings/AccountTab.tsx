import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Clock, Key, Settings, User } from "lucide-react";
import { ReactNode } from "react";

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

interface ActionButtonProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  variant?: "outline" | "destructive";
  className?: string;
}

function ActionButton({ 
  icon, 
  title, 
  subtitle, 
  onClick, 
  variant = "outline",
  className = ""
}: ActionButtonProps) {
  const baseClasses = "justify-start h-20 p-0 overflow-hidden";
  const variantClasses = variant === "outline" 
    ? "border-gray-600 text-gray-200 hover:bg-gray-700" 
    : "";
  
  return (
    <Button 
      variant={variant}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <div className="flex items-center w-full h-full px-6 py-4">
        <div className="mr-4 flex-shrink-0">
          {icon}
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="font-medium text-base truncate">{title}</div>
          {subtitle && (
            <div className="text-xs text-gray-500 mt-1 truncate opacity-75">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </Button>
  );
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
            <ActionButton
              icon={<Key className="h-6 w-6 text-blue-400" />}
              title="Change Password"
              subtitle={stats?.passwordLastChanged ? `Last changed: ${stats.passwordLastChanged}` : undefined}
              onClick={onChangePassword}
            />
            
            <ActionButton
              icon={<User className="h-6 w-6 text-green-400" />}
              title="Update Profile"
              subtitle="Edit username and email"
              onClick={onUpdateProfile}
            />
            
            <ActionButton
              icon={<Clock className="h-6 w-6 text-purple-400" />}
              title="Account Activity"
              subtitle={user?.lastActiveAt 
                ? `Last active: ${new Date(user.lastActiveAt).toLocaleDateString()}`
                : "View recent account activity"
              }
              onClick={onAccountActivity}
            />
            
            <ActionButton
              icon={<ArrowLeft className="h-6 w-6" />}
              title="Sign Out"
              subtitle="Log out of your account"
              onClick={onLogout}
              variant="destructive"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-900/20 border-red-700">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Danger Zone (Admin Only)
          </CardTitle>
          <CardDescription className="text-gray-400">
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActionButton
            icon={<AlertTriangle className="h-6 w-6" />}
            title="Delete Account"
            subtitle="Permanently delete your account and all data"
            onClick={onDeleteAccount}
            variant="destructive"
            className="w-full max-w-md"
          />
        </CardContent>
      </Card>
    </div>
  );
}
