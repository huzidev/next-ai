import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/router";

interface ProfileDropdownProps {
  user: any;
  authLoading: boolean;
  onLogout: () => void;
}

export function ProfileDropdown({ user, authLoading, onLogout }: ProfileDropdownProps) {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  const handlePlansClick = () => {
    router.push('/plans');
  };

  const handleProfileClick = () => {
    router.push('/settings?tab=profile');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-600 text-white">
              {user?.username ? user.username.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-gray-800 border-gray-700" align="end" forceMount>
        <div className="flex items-center space-x-3 p-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-600 text-white text-lg">
              {user?.username ? user.username.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">
              {authLoading ? "Loading..." : (user?.username || "Unknown User")}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {authLoading ? "Loading..." : user?.email}
            </p>
            <p className="text-xs text-gray-500">
              {authLoading ? (
                "Loading plan..."
              ) : user ? (
                `${user.plan?.name ? user.plan.name.charAt(0).toUpperCase() + user.plan.name.slice(1) : 'Free'} Plan • ${user.remainingTries} credits`
              ) : (
                "Plan unavailable"
              )}
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={handleProfileClick}
          className="cursor-pointer hover:bg-gray-700 text-gray-200 focus:bg-gray-700 focus:text-white"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleSettingsClick}
          className="cursor-pointer hover:bg-gray-700 text-gray-200 focus:bg-gray-700 focus:text-white"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handlePlansClick}
          className="cursor-pointer hover:bg-gray-700 text-gray-200 focus:bg-gray-700 focus:text-white"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Plans & Billing</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={onLogout}
          className="cursor-pointer hover:bg-red-600/20 text-red-400 focus:bg-red-600/20 focus:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
