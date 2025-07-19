import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Bell,
  Bot,
  Crown,
  Filter,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  UserX
} from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isBan: boolean;
  planId: string;
  remainingTries: number;
  createdAt: Date;
  lastActiveAt?: Date;
}

interface Admin {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  createdAt: Date;
  createdBy?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock data
  const [users] = useState<User[]>([
    {
      id: "1",
      username: "john_doe",
      email: "john@example.com",
      isVerified: true,
      isBan: false,
      planId: "free",
      remainingTries: 45,
      createdAt: new Date("2024-01-15"),
      lastActiveAt: new Date("2024-01-20")
    },
    {
      id: "2",
      username: "jane_smith",
      email: "jane@example.com",
      isVerified: false,
      isBan: false,
      planId: "free",
      remainingTries: 50,
      createdAt: new Date("2024-01-18"),
    },
    {
      id: "3",
      username: "bob_banned",
      email: "bob@example.com",
      isVerified: true,
      isBan: true,
      planId: "free",
      remainingTries: 0,
      createdAt: new Date("2024-01-10"),
      lastActiveAt: new Date("2024-01-16")
    }
  ]);

  const [admins] = useState<Admin[]>([
    {
      id: "1",
      username: "super_admin",
      email: "super@nextai.com",
      role: "SUPER_ADMIN",
      isActive: true,
      createdAt: new Date("2024-01-01")
    },
    {
      id: "2",
      username: "admin_user",
      email: "admin@nextai.com",
      role: "ADMIN",
      isActive: true,
      createdAt: new Date("2024-01-05"),
      createdBy: "1"
    }
  ]);

  const handleUserAction = (userId: string, action: "ban" | "unban" | "verify" | "unverify") => {
    toast({
      title: "Action Completed",
      description: `User has been ${action}ed successfully`,
    });
  };

  const createAdmin = () => {
    toast({
      title: "Create Admin",
      description: "Admin creation dialog would open here",
    });
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter(u => u.isVerified).length,
    bannedUsers: users.filter(u => u.isBan).length,
    activeToday: users.filter(u => u.lastActiveAt && 
      new Date(u.lastActiveAt).toDateString() === new Date().toDateString()).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800/50 border-r border-slate-700 flex flex-col backdrop-blur">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Next-AI
              </span>
            </div>
            
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-400">
              <Crown className="h-3 w-3 mr-1" />
              Admin Dashboard
            </Badge>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-700"
              onClick={() => setActiveTab("overview")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </Button>
            
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-700"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
            
            <Button
              variant={activeTab === "admins" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-700"
              onClick={() => setActiveTab("admins")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admins
            </Button>
            
            <Button
              variant={activeTab === "messages" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-700"
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
              <Badge variant="destructive" className="ml-auto">5</Badge>
            </Button>
            
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-700"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Admin Profile */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-purple-600">
                  <Crown className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Super Admin</p>
                <p className="text-xs text-slate-400">admin@nextai.com</p>
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-auto">8</Badge>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 bg-slate-800/30 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white capitalize">
                  {activeTab === "overview" ? "Dashboard Overview" : activeTab}
                </h1>
                <p className="text-slate-400 mt-1">
                  {activeTab === "overview" && "Monitor and manage your Next-AI platform"}
                  {activeTab === "users" && "Manage user accounts and permissions"}
                  {activeTab === "admins" && "Manage admin accounts and roles"}
                  {activeTab === "messages" && "View and respond to user messages"}
                  {activeTab === "settings" && "Configure platform settings"}
                </p>
              </div>
              
              {activeTab === "admins" && (
                <Button 
                  onClick={createAdmin}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Admin
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                      <div className="flex items-center text-sm text-green-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +12% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Verified Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.verifiedUsers}</div>
                      <div className="text-sm text-slate-400">
                        {Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% verification rate
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Active Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.activeToday}</div>
                      <div className="text-sm text-slate-400">Users active today</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Banned Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.bannedUsers}</div>
                      <div className="text-sm text-red-400">Requires attention</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-300">User john_doe verified their account</span>
                        <span className="text-xs text-slate-500 ml-auto">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-300">New admin created by super_admin</span>
                        <span className="text-xs text-slate-500 ml-auto">4 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-slate-300">User bob_banned was banned</span>
                        <span className="text-xs text-slate-500 ml-auto">1 day ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Users Table */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">User</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Plan</TableHead>
                        <TableHead className="text-slate-300">Tries Left</TableHead>
                        <TableHead className="text-slate-300">Joined</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-slate-700">
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{user.username}</div>
                              <div className="text-sm text-slate-400">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Badge variant={user.isVerified ? "default" : "secondary"}>
                                {user.isVerified ? "Verified" : "Unverified"}
                              </Badge>
                              {user.isBan && (
                                <Badge variant="destructive">Banned</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {user.planId}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">{user.remainingTries}</TableCell>
                          <TableCell className="text-slate-300">
                            {user.createdAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-slate-300">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                                {!user.isVerified && (
                                  <DropdownMenuItem 
                                    onClick={() => handleUserAction(user.id, "verify")}
                                    className="text-slate-300 hover:bg-slate-700"
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Verify User
                                  </DropdownMenuItem>
                                )}
                                {user.isVerified && (
                                  <DropdownMenuItem 
                                    onClick={() => handleUserAction(user.id, "unverify")}
                                    className="text-slate-300 hover:bg-slate-700"
                                  >
                                    <UserX className="h-4 w-4 mr-2" />
                                    Unverify User
                                  </DropdownMenuItem>
                                )}
                                {!user.isBan ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleUserAction(user.id, "ban")}
                                    className="text-red-400 hover:bg-slate-700"
                                  >
                                    <UserX className="h-4 w-4 mr-2" />
                                    Ban User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleUserAction(user.id, "unban")}
                                    className="text-green-400 hover:bg-slate-700"
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Unban User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {activeTab === "admins" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Admin Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">Admin</TableHead>
                          <TableHead className="text-slate-300">Role</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Created</TableHead>
                          <TableHead className="text-slate-300">Created By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admins.map((admin) => (
                          <TableRow key={admin.id} className="border-slate-700">
                            <TableCell>
                              <div>
                                <div className="font-medium text-white">{admin.username}</div>
                                <div className="text-sm text-slate-400">{admin.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={admin.role === "SUPER_ADMIN" ? "default" : "secondary"}
                                className={admin.role === "SUPER_ADMIN" ? "bg-purple-600" : ""}
                              >
                                {admin.role === "SUPER_ADMIN" && <Crown className="h-3 w-3 mr-1" />}
                                {admin.role.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={admin.isActive ? "default" : "secondary"}>
                                {admin.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {admin.createdAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {admin.createdBy ? "Super Admin" : "System"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">User Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        Real-time messaging
                      </h3>
                      <p className="text-slate-400">
                        Socket.IO powered messaging system will be integrated here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Platform Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        Settings Panel
                      </h3>
                      <p className="text-slate-400">
                        Platform configuration options will be available here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
