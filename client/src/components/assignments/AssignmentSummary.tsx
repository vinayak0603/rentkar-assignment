
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssignmentMetrics } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

type AssignmentSummaryProps = {
  metrics: AssignmentMetrics;
  partners: {
    available: number;
    busy: number;
    offline: number;
  };
};

const AssignmentSummary = ({ metrics, partners }: AssignmentSummaryProps) => {
  const isMobile = useIsMobile();
  const totalPartners = partners.available + partners.busy + partners.offline;
  
  // Safely calculate percentages to avoid division by zero
  const availablePercent = totalPartners ? (partners.available / totalPartners) * 100 : 0;
  const busyPercent = totalPartners ? (partners.busy / totalPartners) * 100 : 0;
  const offlinePercent = totalPartners ? (partners.offline / totalPartners) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Assignment Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Total Assigned</div>
                <div className="text-2xl font-bold">{metrics.totalAssigned}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
                <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Avg Time</div>
                <div className="text-2xl font-bold">{metrics.averageTime} min</div>
              </div>
            </div>

            <div className="pt-2 mt-4 border-t">
              <h4 className="text-sm font-semibold mb-2">Failure Reasons</h4>
              {metrics.failureReasons.length > 0 ? (
                <ul className="space-y-2">
                  {metrics.failureReasons.map((reason, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{reason.reason}</span>
                      <span className="font-medium">{reason.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No failures recorded</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Partner Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Available</span>
              <div className="flex items-center">
                <span className="text-sm font-medium">{partners.available}</span>
                <span className="text-xs text-muted-foreground ml-1">({availablePercent.toFixed(0)}%)</span>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${availablePercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Busy</span>
              <div className="flex items-center">
                <span className="text-sm font-medium">{partners.busy}</span>
                <span className="text-xs text-muted-foreground ml-1">({busyPercent.toFixed(0)}%)</span>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${busyPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Offline</span>
              <div className="flex items-center">
                <span className="text-sm font-medium">{partners.offline}</span>
                <span className="text-xs text-muted-foreground ml-1">({offlinePercent.toFixed(0)}%)</span>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="bg-gray-500 h-2 rounded-full"
                style={{ width: `${offlinePercent}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentSummary;
