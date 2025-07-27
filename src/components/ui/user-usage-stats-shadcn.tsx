import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ActivityIcon, BarChart3, MessageSquare, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

interface UserUsageStatsShadcnProps {
  className?: string;
}

const chartConfig = {
  messages: {
    label: "Messages",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export function UserUsageStatsShadcn({ className }: UserUsageStatsShadcnProps) {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

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
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
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
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={usageData.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
            <ChartTooltip 
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="messages" fill="#3B82F6" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={usageData.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
            <ChartTooltip 
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Line type="monotone" dataKey="messages" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
          </LineChart>
        );
      default:
        return (
          <AreaChart data={usageData.chartData}>
            <defs>
              <linearGradient id="colorMessagesShadcn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
            <ChartTooltip 
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="messages" 
              stroke="#3B82F6" 
              fillOpacity={1}
              fill="url(#colorMessagesShadcn)" 
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Chart Type Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Shadcn Charts - Usage Analytics</h2>
          <p className="text-gray-400">Compare different chart styles with shadcn/ui</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'area' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'line' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Line
          </button>
        </div>
      </div>

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

      {/* Usage Chart with Shadcn */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">7-Day Activity ({chartType} chart)</CardTitle>
          <CardDescription className="text-gray-400">
            Your message activity over the last 7 days - Powered by shadcn/ui charts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            {renderChart()}
          </ChartContainer>
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

      {/* Comparison Note */}
      <Card className="bg-gray-800 border-blue-700">
        <CardHeader>
          <CardTitle className="text-blue-400">Shadcn Charts vs Recharts</CardTitle>
          <CardDescription className="text-gray-400">
            This component uses shadcn/ui chart components for better theming and consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-white"><strong>Advantages:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Automatic theme integration (light/dark mode)</li>
              <li>Consistent styling with your design system</li>
              <li>Better TypeScript support</li>
              <li>Multiple chart types with easy switching</li>
              <li>Built-in accessibility features</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
