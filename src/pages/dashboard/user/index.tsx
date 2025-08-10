import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { NewChatModal } from "@/components/ui/new-chat-modal";
import { NotificationButton } from "@/components/ui/notification-button";
import { Notification, NotificationsSidebar } from "@/components/ui/notifications-sidebar";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { SelectFriendModal } from "@/components/ui/select-friend-modal";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Bot,
  Image as ImageIcon,
  Megaphone,
  Plus,
  Send,
  Settings,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Upload,
  User,
  UserCheck,
  Users
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
  updatedAt: Date;
}

interface Friend {
  id: string;
  username: string;
  email: string;
  isOnline?: boolean;
  lastActive?: string;
  hasActiveChat?: boolean;
}

export default function UserDashboard() {
  const { user, isLoading: authLoading, logout, updateTries, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Debug user data
  console.log("SW Dashboard user data:", user);
  console.log("SW Dashboard isAuthenticated:", isAuthenticated);
  console.log("SW Dashboard authLoading:", authLoading);
  
  // Monitor user data changes
  useEffect(() => {
    console.log("SW Dashboard useEffect - user data changed:", user);
    console.log("SW Dashboard useEffect - localStorage token:", typeof window !== 'undefined' ? localStorage.getItem('authToken')?.substring(0, 20) + '...' : 'N/A');
  }, [user]);
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [userChats, setUserChats] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [newChatModalOpen, setNewChatModalOpen] = useState<boolean>(false);
  const [selectFriendModalOpen, setSelectFriendModalOpen] = useState<boolean>(false);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [notificationsSidebarOpen, setNotificationsSidebarOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'ai' | 'user'>('ai'); // New state for chat mode toggle
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Next-AI!',
      message: 'Start chatting with our AI assistant to get help with your questions.',
      type: 'success',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: '2',
      title: 'Plan Upgrade Available',
      message: 'Upgrade to Pro plan to get 500 AI conversations per month and priority support.',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '3',
      title: 'Low Credits Warning',
      message: 'You have 5 credits remaining. Consider upgrading your plan to continue chatting.',
      type: 'warning',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '4',
      title: 'New Feature: Image Upload',
      message: 'You can now upload images in your conversations for AI analysis!',
      type: 'update',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeSession = [...sessions, ...userChats].find(s => s.id === activeSessionId);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  
  // Compute current sessions and counts based on chat mode
  const currentSessions = chatMode === 'ai' ? sessions : userChats;
  const aiChatCount = sessions.length;
  const userChatCount = userChats.length;

  // Load chat sessions from database
  const loadChatSessions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found');
        setIsLoadingSessions(false);
        return;
      }

      const response = await fetch('/api/chat/sessions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const formattedSessions: ChatSession[] = data.sessions.map((session: any) => ({
          id: session.id,
          title: session.title,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role,
            timestamp: new Date(msg.createdAt),
            imageUrl: msg.imageUrl,
          })),
        }));

        setSessions(formattedSessions);
        
        // Set active session to the most recent one or leave empty if none exist
        if (formattedSessions.length > 0) {
          setActiveSessionId(formattedSessions[0].id);
        }
      } else {
        console.error('Failed to load sessions:', data.error);
        toast({
          title: "Error",
          description: "Failed to load chat sessions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Load user chats (mock for now - will be replaced with actual API)
  const loadUserChats = async () => {
    try {
      // Mock user chats for now
      const mockUserChats: ChatSession[] = [
        {
          id: 'user-chat-1',
          title: 'Chat with @john_doe',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          messages: [
            {
              id: '1',
              content: 'Hey! How are you doing?',
              role: 'user',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
              id: '2',
              content: 'I\'m doing great, thanks for asking!',
              role: 'assistant',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'user-chat-2',
          title: 'Chat with @alice_smith',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
          messages: [
            {
              id: '3',
              content: 'Did you finish the project?',
              role: 'user',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          ]
        }
      ];
      
      setUserChats(mockUserChats);
    } catch (error) {
      console.error('Error loading user chats:', error);
    }
  };

  // Load sessions when component mounts and user is available
  useEffect(() => {
    if (user && !authLoading) {
      loadChatSessions();
      loadUserChats();
    }
  }, [user, authLoading]);

  // Handle chat mode change
  useEffect(() => {
    // Reset active session when switching modes
    if (currentSessions.length > 0) {
      setActiveSessionId(currentSessions[0].id);
    } else {
      setActiveSessionId(null);
    }
  }, [chatMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages]);

  const createNewSession = () => {
    if (chatMode === 'ai') {
      setNewChatModalOpen(true);
    } else {
      setSelectFriendModalOpen(true);
    }
  };

  const handleCreateChat = async (title: string) => {
    setIsCreatingChat(true);
    try {
      if (chatMode === 'ai') {
        // Create AI chat
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
            createdAt: new Date(data.session.createdAt),
            updatedAt: new Date(data.session.updatedAt)
          };
          setSessions(prev => [newSession, ...prev]);
          setActiveSessionId(newSession.id);
          setNewChatModalOpen(false);

          toast({
            title: "Success",
            description: "New AI chat session created successfully",
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
      } else {
        // Create user chat (mock for now)
        const newUserChat: ChatSession = {
          id: `user-chat-${Date.now()}`,
          title: title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setUserChats(prev => [newUserChat, ...prev]);
        setActiveSessionId(newUserChat.id);
        setNewChatModalOpen(false);

        toast({
          title: "Success",
          description: "New chat session created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create new ${chatMode} chat session`,
        variant: "destructive",
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSelectFriend = async (friend: Friend) => {
    setIsCreatingChat(true);
    try {
      // Create user chat with selected friend
      const newUserChat: ChatSession = {
        id: `user-chat-${Date.now()}`,
        title: `Chat with @${friend.username}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUserChats(prev => [newUserChat, ...prev]);
      setActiveSessionId(newUserChat.id);
      setSelectFriendModalOpen(false);

      toast({
        title: "Success",
        description: `New chat started with @${friend.username}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chat with friend",
        variant: "destructive",
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    if (currentSessions.length === 1) {
      toast({
        title: "Cannot delete",
        description: `You must have at least one chat session`,
        variant: "destructive",
      });
      return;
    }
    
    // Open confirmation modal
    setSessionToDelete(sessionId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      if (chatMode === 'ai') {
        // Delete AI chat from database
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/chat/sessions', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId: sessionToDelete }),
        });

        const data = await response.json();

        if (data.success) {
          const updatedSessions = sessions.filter(s => s.id !== sessionToDelete);
          setSessions(updatedSessions);
          
          if (sessionToDelete === activeSessionId) {
            setActiveSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : null);
          }

          toast({
            title: "AI Chat deleted",
            description: "The AI chat session has been deleted successfully",
          });
        } else {
          throw new Error(data.error);
        }
      } else {
        // Delete user chat (local only for now)
        const updatedUserChats = userChats.filter(s => s.id !== sessionToDelete);
        setUserChats(updatedUserChats);
        
        if (sessionToDelete === activeSessionId) {
          setActiveSessionId(updatedUserChats.length > 0 ? updatedUserChats[0].id : null);
        }

        toast({
          title: "Friend Chat deleted",
          description: "The chat session has been deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${chatMode} chat session`,
        variant: "destructive",
      });
    } finally {
      // Close modal and reset state
      setDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const saveMessageToDatabase = async (sessionId: string, content: string, role: 'user' | 'assistant', imageUrl?: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          content,
          role,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.message;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
    if (!activeSessionId) {
      toast({
        title: "Error",
        description: `No active ${chatMode} chat session`,
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined
    };

    // Update local state immediately for better UX
    if (chatMode === 'ai') {
      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      ));
    } else {
      setUserChats(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      ));
    }

    const userMessageContent = message;
    setMessage("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      if (chatMode === 'ai') {
        // AI Chat Logic
        // Save user message to database
        await saveMessageToDatabase(
          activeSessionId, 
          userMessageContent, 
          'user', 
          userMessage.imageUrl
        );

        // Generate AI response
        console.log('SW Sending message to Gemini API:', userMessageContent);
        
        const response = await fetch('/api/chat/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessageContent
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

        // Save AI response to database
        await saveMessageToDatabase(
          activeSessionId, 
          data.message, 
          'assistant'
        );

        // Update local state with AI response
        setSessions(prev => prev.map(session => 
          session.id === activeSessionId 
            ? { 
                ...session, 
                messages: [...session.messages, aiMessage],
                title: session.messages.length === 1 ? userMessageContent.slice(0, 30) + "..." : session.title
              }
            : session
        ));

        // Update user tries (the API already handles this when saving user messages)
        if (user && user.plan?.name === 'free' && user.remainingTries > 0) {
          updateTries(user.remainingTries - 1);
        }
      } else {
        // User Chat Logic (mock for now)
        // In a real implementation, this would send the message to the other user
        console.log('Sending user message:', userMessageContent);
        
        // Mock response for user chat
        setTimeout(() => {
          const userResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: "Thanks for your message! (This is a mock response)",
            role: "assistant",
            timestamp: new Date()
          };

          setUserChats(prev => prev.map(session => 
            session.id === activeSessionId 
              ? { 
                  ...session, 
                  messages: [...session.messages, userResponse],
                  title: session.messages.length === 1 ? userMessageContent.slice(0, 30) + "..." : session.title
                }
              : session
          ));
          setIsLoading(false);
        }, 1000);
        return;
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove the user message from local state if there was an error
      if (chatMode === 'ai') {
        setSessions(prev => prev.map(session => 
          session.id === activeSessionId 
            ? { ...session, messages: session.messages.filter(msg => msg.id !== userMessage.id) }
            : session
        ));
      } else {
        setUserChats(prev => prev.map(session => 
          session.id === activeSessionId 
            ? { ...session, messages: session.messages.filter(msg => msg.id !== userMessage.id) }
            : session
        ));
      }

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (chatMode === 'ai') {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Notification handlers
  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
    setNotificationsSidebarOpen(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Next-AI
                </span>
              </div>
              
              {/* Chat Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-2">
                <div className="flex items-center space-x-2 text-xs text-gray-300">
                  <span className={chatMode === 'ai' ? 'text-white font-medium' : ''}>
                    AI ({aiChatCount})
                  </span>
                  <button
                    onClick={() => setChatMode(chatMode === 'ai' ? 'user' : 'ai')}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {chatMode === 'ai' ? <ToggleLeft className="h-5 w-5" /> : <ToggleRight className="h-5 w-5" />}
                  </button>
                  <span className={chatMode === 'user' ? 'text-white font-medium' : ''}>
                    Friends ({userChatCount})
                  </span>
                </div>
              </div>
            </div>
            
            <Button onClick={createNewSession} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isLoadingSessions ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-gray-700 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : currentSessions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-sm">No {chatMode === 'ai' ? 'AI' : 'friend'} chats yet</p>
                <p className="text-xs">Create your first chat to get started</p>
              </div>
            ) : (
              currentSessions.map((session) => (
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
                      <div className="flex items-center space-x-2">
                        {chatMode === 'ai' ? (
                          <Bot className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        ) : (
                          <User className="h-4 w-4 text-green-400 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium text-gray-200 truncate">
                          {session.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 ml-6">
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
              ))
            )}
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
                    {chatMode === 'ai' ? "Powered by Google Generative AI" : "Chat with friends"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/announcements')}
                    className="text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <Megaphone className="h-4 w-4 mr-2" />
                    Announcements
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/friends')}
                    className="text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Friends
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/users')}
                    className="text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Users
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/contact')}
                    className="text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Support
                  </Button>
                </div>
                
                <NotificationButton
                  hasUnread={unreadNotifications > 0}
                  unreadCount={unreadNotifications}
                  onClick={() => setNotificationsSidebarOpen(true)}
                />
                
                <ProfileDropdown
                  user={user}
                  authLoading={authLoading}
                  onLogout={logout}
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoadingSessions ? (
              <div className="text-center py-12">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">
                  Loading your chats...
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Please wait while we load your chat sessions.
                </p>
              </div>
            ) : !activeSession ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">
                  No chat selected
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Create a new chat or select an existing one to start chatting.
                </p>
              </div>
            ) : activeSession.messages.length === 0 ? (
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
              activeSession.messages.map((msg) => (
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
                  placeholder={activeSession ? "Type your message..." : `Select or create a chat to start messaging...`}
                  className="pr-12"
                  disabled={isLoading || !activeSession}
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
                  disabled={!activeSession}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={sendMessage}
                disabled={isLoading || (!message.trim() && !selectedImage) || !activeSession}
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
        description={`Are you sure you want to delete "${[...sessions, ...userChats].find(s => s.id === sessionToDelete)?.title}"? This action cannot be undone and all messages in this ${chatMode} chat will be permanently lost.`}
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

      <SelectFriendModal
        isOpen={selectFriendModalOpen}
        onClose={() => setSelectFriendModalOpen(false)}
        onSelectFriend={handleSelectFriend}
        isLoading={isCreatingChat}
        existingUserChats={userChats}
      />

      <NotificationsSidebar
        isOpen={notificationsSidebarOpen}
        onClose={() => setNotificationsSidebarOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationClick={handleNotificationClick}
      />
      
      <Toaster />
    </div>
  );
}
