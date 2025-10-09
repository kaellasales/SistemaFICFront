import { useEffect } from 'react';
import { useDashboardStore } from '../stores/useDashboardStore';
import { useAuthStore } from '@/shared/stores/authStore';

export function useDashboard() {
  const { user } = useAuthStore();
  const { stats, recentActivities, quickActions, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    if (user?.groups) {
      fetchDashboardData(user.groups);
    }
  }, [user, fetchDashboardData]);

  return { user, stats, recentActivities, quickActions, loading };
}