import { RouteGuard } from "@/components/auth/RouteGuard";
import { AccountTab } from "@/components/settings/AccountTab";
import { PlansTab } from "@/components/settings/PlansTab";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { UsageTab } from "@/components/settings/UsageTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChangePasswordModal } from "@/components/ui/change-password-modal";
import { DeleteAccountModal } from "@/components/ui/delete-account-modal";
import { EditProfileModal } from "@/components/ui/edit-profile-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, ArrowLeft, Crown } from "lucide-react";
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
  const { user, isAuthenticated, logout, isLoading: authLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

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
    setIsEditProfileOpen(true);
  };

  const handleUpdateProfile = async (profileData: Partial<typeof user>) => {
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const result = await response.json();
        updateProfile(result.user);
        return true;
      } else {
        const error = await response.json();
        console.error('Profile update failed:', error.message);
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const handleUpdatePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        console.log('Password updated successfully');
        return true;
      } else {
        const error = await response.json();
        console.error('Password update failed:', error.message);
        return false;
      }
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };

  const handleChangePlan = () => {
    router.push('/plans');
  };

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleUpdateProfileFromAccount = () => {
    setIsEditProfileOpen(true);
  };

  const handleAccountActivity = () => {
    // Could show a modal with account activity or navigate to activity page
    console.log('Show account activity');
  };

  const handleDeleteAccount = () => {
    setIsDeleteAccountOpen(true);
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        console.log('Account deleted successfully');
        // Clear local storage and redirect to home
        localStorage.removeItem('token');
        router.replace('/');
        return true;
      } else {
        const error = await response.json();
        console.error('Account deletion failed:', error.message);
        return false;
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
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

            {/* Tab links as array of objects, mapped to TabsTrigger */}
            <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-3/4 bg-gray-800 border border-gray-700 p-1 rounded-lg">
              {[
              { value: "profile", label: "Profile" },
              { value: "usage", label: "Usage" },
              { value: "plans", label: "Plans" },
              { value: "account", label: "Account" },
              ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
              >
                {tab.label}
              </TabsTrigger>
              ))}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <ProfileTab
                user={user}
                authLoading={authLoading}
                loading={loading}
                stats={stats}
                onEditProfile={handleEditProfile}
                onChangePlan={handleChangePlan}
              />
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="space-y-6">
              <UsageTab />
            </TabsContent>

            {/* Plans Tab */}
            <TabsContent value="plans" className="space-y-6">
              <PlansTab
                user={user}
                onChangePlan={handleChangePlan}
              />
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <AccountTab
                user={user}
                stats={stats}
                onChangePassword={handleChangePassword}
                onUpdateProfile={handleUpdateProfileFromAccount}
                onAccountActivity={handleAccountActivity}
                onDeleteAccount={handleDeleteAccount}
                onLogout={logout}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={user}
          onUpdate={handleUpdateProfile}
        />

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          onUpdate={handleUpdatePassword}
        />

        {/* Delete Account Modal */}
        <DeleteAccountModal
          isOpen={isDeleteAccountOpen}
          onClose={() => setIsDeleteAccountOpen(false)}
          onConfirm={handleConfirmDeleteAccount}
          username={user?.username}
        />
      </div>
    </RouteGuard>
  );
}
