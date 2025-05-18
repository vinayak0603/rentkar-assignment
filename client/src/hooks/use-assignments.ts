
import { useState, useEffect } from 'react';
import { Assignment, AssignmentMetrics, DeliveryPartner, Order } from '@/types';
import { assignmentAPI, orderAPI, partnerAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function useAssignments() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [metrics, setMetrics] = useState<AssignmentMetrics>({
    totalAssigned: 0,
    successRate: 0,
    averageTime: 0,
    failureReasons: [],
  });
  const [partnerStats, setPartnerStats] = useState({
    available: 0,
    busy: 0,
    offline: 0,
  });
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [assignmentsData, ordersData, partnersData, metricsData] = await Promise.all([
        assignmentAPI.getAssignments(),
        orderAPI.getOrders(),
        partnerAPI.getPartners(),
        assignmentAPI.getMetrics(),
      ]);
      
      setAssignments(assignmentsData);
      setOrders(ordersData);
      setPartners(partnersData);
      setMetrics(metricsData);
      
      // Calculate partner stats
      const available = partnersData.filter(p => p.status === 'active' && p.currentLoad === 0).length;
      const busy = partnersData.filter(p => p.status === 'active' && p.currentLoad > 0).length;
      const offline = partnersData.filter(p => p.status === 'inactive').length;
      
      setPartnerStats({
        available,
        busy,
        offline,
      });
      
    } catch (err) {
      console.error('Error fetching assignment data:', err);
      setError('Failed to load assignments data');
      toast({
        title: 'Error',
        description: 'Failed to load assignments data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const runAssignment = async () => {
    if (running) return;
    
    try {
      setRunning(true);
      setError(null);
      
      const newAssignments = await assignmentAPI.runAssignment();
      
      // Refresh data
      await fetchData();
      
      toast({
        title: 'Success',
        description: `Assignment completed: ${newAssignments.filter(a => a.status === 'success').length} successful, ${newAssignments.filter(a => a.status === 'failed').length} failed`,
      });
    } catch (err) {
      console.error('Error running assignment:', err);
      setError('Failed to run assignments');
      toast({
        title: 'Error',
        description: 'Failed to run assignments',
        variant: 'destructive',
      });
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    assignments,
    orders,
    partners,
    metrics,
    partnerStats,
    loading,
    running,
    error,
    fetchData,
    runAssignment
  };
}
