import { CreateAdminModal } from "@/components/admin/CreateAdminModal";
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
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  Activity,
  Bell,
  Bot,
  Crown,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  UserX
} from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
  const { toast } = useToast();
  const { stats, loading, error, refetch } = useDashboardStats();

  console.log("SW stats", stats);

  // Handle loading state
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">⚠️ Error loading dashboard</div>
          <p className="text-slate-300 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${action} successful`,
        });
        refetch(); // Refresh the data
      } else {
        throw new Error("Failed to perform action");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform user action",
        variant: "destructive",
      });
    }
  };

  const createAdmin = () => {
    setIsCreateAdminModalOpen(true);
  };

  const handleCreateAdminSuccess = () => {
    refetch(); // Refresh the dashboard data
  };

  const filteredUsers = stats?.users?.recent?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 bg-slate-800/50 border-r border-slate-700 flex flex-col backdrop-blur">
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
                  <p className="text-sm text-slate-400">Next-AI Dashboard</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "overview"
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "users"
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                  <Badge variant="secondary" className="ml-auto">
                    {stats?.users?.total || 0}
                  </Badge>
                </button>
                <button
                  onClick={() => setActiveTab("admins")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "admins"
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admins</span>
                  <Badge variant="secondary" className="ml-auto">
                    {stats?.admins?.total || 0}
                  </Badge>
                </button>
                <button
                  onClick={() => setActiveTab("chats")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "chats"
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Chats</span>
                  <Badge variant="secondary" className="ml-auto">
                    {stats?.chat?.activeSessions || 0}
                  </Badge>
                </button>
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-600 text-white text-sm">
                      {stats?.admins?.current?.username?.charAt(0).toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {stats?.admins?.current?.username || 'Admin'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {stats?.admins?.current?.role?.replace('_', ' ') || 'System Admin'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div className="h-16 bg-slate-800/30 border-b border-slate-700 flex items-center justify-between px-6 backdrop-blur">
              <div>
                <h2 className="text-xl font-semibold text-white capitalize">{activeTab}</h2>
                <p className="text-sm text-slate-400">Real-time dashboard statistics</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-auto">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.users?.total || 0}</div>
                        <p className="text-xs text-slate-400">
                          {stats?.users?.verified || 0} verified, {stats?.users?.banned || 0} banned
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Verified Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.users?.verified || 0}</div>
                        <p className="text-xs text-slate-400">
                          {stats?.users?.total ? Math.round(((stats?.users?.verified || 0) / stats.users.total) * 100) : 0}% verification rate
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Active Today</CardTitle>
                        <Activity className="h-4 w-4 text-purple-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.users?.activeToday || 0}</div>
                        <p className="text-xs text-slate-400">Users active in last 24h</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Admins</CardTitle>
                        <Shield className="h-4 w-4 text-yellow-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.admins?.total || 0}</div>
                        <p className="text-xs text-slate-400">
                          {stats?.admins?.superAdmins || 0} super, {stats?.admins?.regularAdmins || 0} regular
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Chat Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Chat Sessions</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.chat?.totalSessions || 0}</div>
                        <p className="text-xs text-slate-400">{stats?.chat?.activeSessions || 0} active</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Messages</CardTitle>
                        <Bot className="h-4 w-4 text-green-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.chat?.totalMessages || 0}</div>
                        <p className="text-xs text-slate-400">{stats?.chat?.todayMessages || 0} today</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Banned Users</CardTitle>
                        <UserX className="h-4 w-4 text-red-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.users?.banned || 0}</div>
                        <p className="text-xs text-slate-400">Temporarily suspended</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="space-y-6">
                  {/* Search and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  {/* Users Table */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-slate-300">User</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Plan</TableHead>
                            <TableHead className="text-slate-300">Tries</TableHead>
                            <TableHead className="text-slate-300">Joined</TableHead>
                            <TableHead className="text-slate-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                                {stats?.users?.recent?.length === 0 ? "No users found" : `No users match search "${searchTerm}"`}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredUsers.map((user) => (
                            <TableRow key={user.id} className="border-slate-700">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-purple-600 text-white">
                                      {user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-white">{user.username}</div>
                                    <div className="text-sm text-slate-400">{user.email}</div>
                                  </div>
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
                              <TableCell className="text-slate-300">
                                {user.plan?.name || "Free"}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {user.remainingTries}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                    <DropdownMenuItem
                                      onClick={() => handleUserAction(user.id, user.isVerified ? "unverify" : "verify")}
                                      className="text-slate-300"
                                    >
                                      {user.isVerified ? "Unverify" : "Verify"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUserAction(user.id, user.isBan ? "unban" : "ban")}
                                      className="text-slate-300"
                                    >
                                      {user.isBan ? "Unban" : "Ban"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "admins" && (
                <div className="space-y-6">
                  {/* Admin Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">Admin Management</h3>
                      <p className="text-sm text-slate-400">Manage administrative access</p>
                    </div>
                    {stats?.admins?.current?.role === 'SUPER_ADMIN' && (
                      <Button onClick={createAdmin} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Admin
                      </Button>
                    )}
                  </div>

                  {/* Admins Table */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Administrators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-slate-300">Admin</TableHead>
                            <TableHead className="text-slate-300">Role</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Created By</TableHead>
                            <TableHead className="text-slate-300">Created</TableHead>
                            <TableHead className="text-slate-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(stats?.admins?.list || []).map((admin) => (
                            <TableRow key={admin.id} className="border-slate-700">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-purple-600 text-white">
                                      {admin.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-white">{admin.username}</div>
                                    <div className="text-sm text-slate-400">{admin.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={admin.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                                  {admin.role === "SUPER_ADMIN" && <Crown className="h-3 w-3 mr-1" />}
                                  {admin.role.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={admin.isActive ? "default" : "destructive"}>
                                  {admin.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {admin.creator?.username || "System"}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {new Date(admin.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                    <DropdownMenuItem className="text-slate-300">
                                      Edit Admin
                                    </DropdownMenuItem>
                                    {admin.role !== "SUPER_ADMIN" && (
                                      <DropdownMenuItem className="text-red-400">
                                        Deactivate
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "chats" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                          Chat Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Sessions:</span>
                          <span className="text-white font-medium">{stats?.chat?.totalSessions || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Active Sessions:</span>
                          <span className="text-white font-medium">{stats?.chat?.activeSessions || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Messages:</span>
                          <span className="text-white font-medium">{stats?.chat?.totalMessages || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Today's Messages:</span>
                          <span className="text-white font-medium">{stats?.chat?.todayMessages || 0}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isCreateAdminModalOpen}
        onClose={() => setIsCreateAdminModalOpen(false)}
        onSuccess={handleCreateAdminSuccess}
        currentAdminRole={stats?.admins?.current?.role}
      />
    </>
  );
}
