import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon, BarChart3, MessageSquare, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface UsageData {
  totalChatSessions: number;
  totalMessages: number;
  recentMessages: number;
  recentSessions: number;
  todayMessages: number;
  remainingTries: number;
  planName: string;
  chartData: Array<{
    date: string;
    messages: number;
    day: string;
  }>;
  usageThisMonth: number;
  averageDaily: number;
}

interface UserUsageStatsProps {
  className?: string;
}

export function UserUsageStats({ className }: UserUsageStatsProps) {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/user/usage-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUsageData(data.data);
      } else {
        setError(data.message || 'Failed to fetch usage statistics');
      }
    } catch (err) {
      setError('Failed to fetch usage statistics');
      console.error('Usage stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-6 bg-gray-600 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="p-6">
            <p className="text-red-400">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {usageData.totalChatSessions}
            </div>
            <p className="text-xs text-gray-500">
              All time sessions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Messages
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {usageData.totalMessages}
            </div>
            <p className="text-xs text-gray-500">
              All time messages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {usageData.usageThisMonth}
            </div>
            <p className="text-xs text-gray-500">
              Messages this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Daily Average
            </CardTitle>
            <ActivityIcon className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {usageData.averageDaily}
            </div>
            <p className="text-xs text-gray-500">
              Messages per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">7-Day Activity</CardTitle>
          <CardDescription className="text-gray-400">
            Your message activity over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData.chartData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  labelFormatter={(label) => `Day: ${label}`}
                  formatter={(value: any) => [value, 'Messages']}
                />
                <Area 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorMessages)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Usage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Activity Summary</CardTitle>
            <CardDescription className="text-gray-400">
              Your recent activity breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Today's Messages</span>
              <span className="text-white font-medium">{usageData.todayMessages}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Recent Sessions (30d)</span>
              <span className="text-white font-medium">{usageData.recentSessions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Recent Messages (30d)</span>
              <span className="text-white font-medium">{usageData.recentMessages}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Remaining Credits</span>
              <span className="text-white font-medium">{usageData.remainingTries}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Plan Information</CardTitle>
            <CardDescription className="text-gray-400">
              Your current subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Plan</span>
              <span className="text-white font-medium capitalize">{usageData.planName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <span className={`font-medium ${usageData.remainingTries > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {usageData.remainingTries > 0 ? 'Active' : 'Credits Exhausted'}
              </span>
            </div>
            {usageData.planName === 'free' && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-blue-400 text-sm">
                  Upgrade to Pro for unlimited messages and advanced features
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
