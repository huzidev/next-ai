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
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
          <Crown className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">
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
          ? 'bg-red-50 border-red-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <Zap className={`h-4 w-4 ${
          isLow ? 'text-red-600' : 'text-blue-600'
        }`} />
        <span className={`text-sm font-medium ${
          isLow ? 'text-red-800' : 'text-blue-800'
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
        <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <div className="flex-1">
            <h4 className="font-medium text-purple-800">No Chats Remaining</h4>
            <p className="text-sm text-purple-600">
              Upgrade to Premium for unlimited AI conversations and advanced features.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-800 mb-1">Free Plan</h5>
            <p className="text-sm text-gray-600 mb-2">50 chats per month</p>
            <Badge variant="secondary">Current Plan</Badge>
          </div>
          <div className="p-3 border border-purple-200 bg-purple-50 rounded-lg">
            <h5 className="font-medium text-purple-800 mb-1">Premium Plan</h5>
            <p className="text-sm text-purple-600 mb-2">Unlimited chats</p>
            <Badge className="bg-purple-600 hover:bg-purple-700">
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
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Start New Chat
          </DialogTitle>
          <DialogDescription>
            Create a new AI conversation. Give it a name or we'll generate one for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {getTriesDisplay()}
          
          {canCreateChat() ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Chat Title (Optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Project Planning, Creative Writing..."
                  disabled={isCreating}
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700"
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
                >
                  Close
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
