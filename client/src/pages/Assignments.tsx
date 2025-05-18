
import React from 'react';
import { Button } from '@/components/ui/button';
import AssignmentSummary from '@/components/assignments/AssignmentSummary';
import ActiveAssignments from '@/components/assignments/ActiveAssignments';
import { useAssignments } from '@/hooks/use-assignments';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';

const Assignments = () => {
  const {
    assignments,
    orders,
    partners,
    metrics,
    partnerStats,
    loading,
    error,
    running,
    fetchData,
    runAssignment
  } = useAssignments();

  if (loading) {
    return <LoadingState message="Loading assignment data..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Assignment System</h1>
          <p className="text-muted-foreground">Automate order assignments to delivery partners</p>
        </div>
        <Button 
          onClick={runAssignment} 
          disabled={running || orders.filter(o => o.status === 'pending').length === 0}
        >
          {running ? 'Running...' : 'Run Assignment'}
        </Button>
      </div>

      <AssignmentSummary 
        metrics={metrics}
        partners={partnerStats}
      />

      <ActiveAssignments 
        assignments={assignments}
        orders={orders}
        partners={partners}
      />
    </div>
  );
};

export default Assignments;
