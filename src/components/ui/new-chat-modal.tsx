import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Crown, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (title: string) => Promise<void>;
  isCreating?: boolean;
}

export function NewChatModal({ 
  isOpen, 
  onClose, 
  onCreateChat,
  isCreating = false 
}: NewChatModalProps) {
  const [title, setTitle] = useState("");
  const { user, isPremiumUser, hasTriesRemaining } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateChat()) return;
    
    await onCreateChat(title || "New Chat");
    setTitle("");
    onClose();
  };

  const canCreateChat = () => {
    return isPremiumUser || hasTriesRemaining;
  };

  const getTriesDisplay = () => {
    if (isPremiumUser) {
      return (
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-lg">
          <Crown className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">
            Premium Plan - Unlimited Chats
          </span>
        </div>
      );
    }

    const remainingTries = user?.remainingTries || 0;
    const isLow = remainingTries <= 5;

    return (
      <div className={`flex items-center gap-2 p-3 border rounded-lg ${
        isLow 
          ? 'bg-red-500/20 border-red-500/30' 
          : 'bg-gray-700/50 border-gray-600'
      }`}>
        <Zap className={`h-4 w-4 ${
          isLow ? 'text-red-400' : 'text-blue-400'
        }`} />
        <span className={`text-sm font-medium ${
          isLow ? 'text-red-300' : 'text-gray-200'
        }`}>
          Free Plan - {remainingTries} chats remaining
        </span>
      </div>
    );
  };

  const getUpgradePrompt = () => {
    if (isPremiumUser || hasTriesRemaining) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <div className="flex-1">
            <h4 className="font-medium text-purple-300">No Chats Remaining</h4>
            <p className="text-sm text-purple-200">
              Upgrade to Premium for unlimited AI conversations and advanced features.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 border border-gray-600 bg-gray-700/50 rounded-lg">
            <h5 className="font-medium text-gray-200 mb-1">Free Plan</h5>
            <p className="text-sm text-gray-400 mb-2">50 chats per month</p>
            <Badge variant="secondary" className="bg-gray-600 text-gray-200">Current Plan</Badge>
          </div>
          <div className="p-3 border border-purple-500/30 bg-purple-500/20 rounded-lg">
            <h5 className="font-medium text-purple-300 mb-1">Premium Plan</h5>
            <p className="text-sm text-purple-200 mb-2">Unlimited chats</p>
            <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
              Upgrade Now
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-200">
            <Sparkles className="h-5 w-5 text-blue-400" />
            Start New Chat
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new AI conversation. Give it a name or we'll generate one for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {getTriesDisplay()}
          
          {canCreateChat() ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-200">Chat Title (Optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Project Planning, Creative Writing..."
                  disabled={isCreating}
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400 focus:border-blue-500"
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isCreating}
                  className="border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isCreating ? "Creating..." : "Start Chat"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <>
              {getUpgradePrompt()}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  Close
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={() => {
                    // TODO: Navigate to upgrade page
                    console.log("Navigate to upgrade page");
                  }}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
