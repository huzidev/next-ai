import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

interface DashboardStats {
  users: {
    total: number;
    verified: number;
    banned: number;
    active: number;
    activeToday: number;
    recent: Array<{
      id: string;
      username: string;
      email: string;
      isVerified: boolean;
      isBan: boolean;
      remainingTries: number;
      createdAt: string;
      lastActiveAt?: string;
      plan?: {
        name: string;
      };
    }>;
  };
  admins: {
    total: number;
    active: number;
    superAdmins: number;
    regularAdmins: number;
    list: Array<{
      id: string;
      username: string;
      email: string;
      role: 'ADMIN' | 'SUPER_ADMIN';
      isActive: boolean;
      createdAt: string;
      createdBy?: string;
      creator?: {
        username: string;
      };
    }>;
  };
  chat: {
    totalSessions: number;
    activeSessions: number;
    totalMessages: number;
    todayMessages: number;
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/admin/dashboard-stats');
      
      console.log('API Response:', response);
      console.log('API Response data:', response.data);
      
      if (response.success) {
        // The API returns { success: true, data: {...} }
        // But our api client puts this whole response in response.data
        // So response.data = { success: true, data: {...} }
        // We need response.data.data
        const actualData = response.data?.data || response.data;
        console.log('Actual data being set:', actualData);
        setStats(actualData);
      } else {
        setError(response.error || 'Failed to fetch dashboard statistics');
      }
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}
