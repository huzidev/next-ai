"use client";

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
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  username?: string;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm, username }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isConfirmValid = confirmText === "CONFIRM";

  const handleConfirm = async () => {
    if (!isConfirmValid) {
      setError('Please type "CONFIRM" exactly as shown');
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const success = await onConfirm();
      if (success) {
        setConfirmText("");
        onClose();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setConfirmText("");
      setError("");
      onClose();
    }
  };

  const handleInputChange = (value: string) => {
    setConfirmText(value);
    if (error) {
      setError("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-red-700">
        <DialogHeader>
          <DialogTitle className="text-red-400 flex items-center text-xl">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base">
            This action cannot be undone. This will permanently delete your account and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Box */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Trash2 className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-red-400">What will be deleted:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Your profile and account information</li>
                  <li>• All chat conversations and history</li>
                  <li>• Your subscription and billing information</li>
                  <li>• All personal settings and preferences</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Account Info */}
          {username && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <span className="text-gray-400">Account to be deleted:</span>
                <br />
                <span className="font-medium text-white">{username}</span>
              </p>
            </div>
          )}

          {/* Confirmation Input */}
          <div className="space-y-3">
            <Label htmlFor="confirmText" className="text-gray-300">
              To confirm deletion, type{" "}
              <span className="font-bold text-red-400 bg-gray-700 px-2 py-1 rounded">
                CONFIRM
              </span>{" "}
              below:
            </Label>
            <Input
              id="confirmText"
              value={confirmText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500"
              placeholder="Type CONFIRM here"
              disabled={isLoading}
              autoComplete="off"
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmValid || isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
