import { RouteGuard } from "@/components/auth/RouteGuard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { NewChatModal } from "@/components/ui/new-chat-modal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Bell,
  Bot,
  Image as ImageIcon,
  LogOut,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  User
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  imageUrl?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function UserDashboard() {
  const { user, isLoading: authLoading, logout, updateTries, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Debug user data
  console.log("SW Dashboard user data:", user);
  console.log("SW Dashboard isAuthenticated:", isAuthenticated);
  console.log("SW Dashboard authLoading:", authLoading);
  
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      createdAt: new Date()
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>("1");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [newChatModalOpen, setNewChatModalOpen] = useState<boolean>(false);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages]);

  const createNewSession = () => {
    setNewChatModalOpen(true);
  };

  const handleCreateChat = async (title: string) => {
    setIsCreatingChat(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (data.success) {
        const newSession: ChatSession = {
          id: data.session.id,
          title: data.session.title,
          messages: [],
          createdAt: new Date(data.session.createdAt)
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newSession.id);
        
        // Deduct try for free users
        if (user && user.plan?.name === 'free' && user.remainingTries > 0) {
          updateTries(user.remainingTries - 1);
        }

        toast({
          title: "Success",
          description: "New chat session created successfully",
        });
      } else if (data.needsUpgrade) {
        toast({
          title: "Upgrade Required",
          description: data.error,
          variant: "destructive",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive",
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    if (sessions.length === 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one chat session",
        variant: "destructive",
      });
      return;
    }
    
    // Open confirmation modal
    setSessionToDelete(sessionId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;

    const updatedSessions = sessions.filter(s => s.id !== sessionToDelete);
    setSessions(updatedSessions);
    
    if (sessionToDelete === activeSessionId) {
      setActiveSessionId(updatedSessions[0].id);
    }

    // Close modal and reset state
    setDeleteModalOpen(false);
    setSessionToDelete(null);

    toast({
      title: "Chat deleted",
      description: "The chat session has been deleted successfully",
    });
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    // Temporarily disable credit check for testing
    // if (user && user.plan?.name === 'free' && user.remainingTries <= 0) {
    //   toast({
    //     title: "No credits remaining",
    //     description: "Please upgrade your plan to continue chatting",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined
    };

    // Update session with user message
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    ));

    setMessage("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Simple test call to Gemini API without authentication
      console.log('SW Sending message to Gemini API:', userMessage.content);
      
      const response = await fetch('/api/chat/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content
        }),
      });

      const data = await response.json();
      console.log('SW API response:', data);

      if (!data.success) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date()
      };

      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, aiMessage],
              title: session.messages.length === 1 ? userMessage.content.slice(0, 30) + "..." : session.title
            }
          : session
      ));

      // Temporarily disable credit update for testing
      // if (user && user.plan?.name === 'free' && user.remainingTries > 0) {
      //   updateTries(user.remainingTries - 1);
      // }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-600">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Next-AI
              </span>
            </div>
            
            <Button onClick={createNewSession} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                  session.id === activeSessionId 
                    ? "bg-blue-600/20 border border-blue-500/30" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setActiveSessionId(session.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {session.messages.length} messages
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-600">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {user?.username ? user.username.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200">
                  {authLoading ? "Loading..." : (user?.username || "Unknown User")}
                </p>
                <p className="text-xs text-gray-400">
                  {authLoading ? (
                    "Loading user data..."
                  ) : user ? (
                    `${user.plan?.name ? user.plan.name.charAt(0).toUpperCase() + user.plan.name.slice(1) : 'Free'} Plan • ${user.remainingTries} remaining`
                  ) : (
                    "User data unavailable"
                  )}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-3 space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-auto">3</Badge>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-gray-600 text-gray-200 hover:bg-gray-700"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-600 bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {activeSession?.title || "New Chat"}
                  </h1>
                  <p className="text-sm text-gray-400">
                    Powered by Google Generative AI
                  </p>
                </div>
              </div>
              
              <Tabs defaultValue="chat" className="w-auto">
                <TabsList>
                  <TabsTrigger value="chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="support">
                    <User className="h-4 w-4 mr-2" />
                    Support
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeSession?.messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Ask me anything! I can help with questions, analyze images, or just have a chat.
                </p>
              </div>
            ) : (
              activeSession?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 border border-gray-600 text-white"
                    }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded"
                        className="rounded-lg mb-2 max-w-full h-auto"
                      />
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.role === "user" ? "text-blue-100" : "text-gray-300"
                    }`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-600 bg-gray-800">
            {selectedImage && (
              <div className="mb-3 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-200">{selectedImage.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-12"
                  disabled={isLoading}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={sendMessage}
                disabled={isLoading || (!message.trim() && !selectedImage)}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Chat Session"
        description={`Are you sure you want to delete "${sessions.find(s => s.id === sessionToDelete)?.title}"? This action cannot be undone and all messages in this chat will be permanently lost.`}
        confirmText="Delete Chat"
        cancelText="Cancel"
        onConfirm={confirmDeleteSession}
        onCancel={cancelDelete}
        variant="destructive"
      />

      <NewChatModal
        isOpen={newChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
        isCreating={isCreatingChat}
      />
      
      <Toaster />
      </div>
    </RouteGuard>
  );
}
