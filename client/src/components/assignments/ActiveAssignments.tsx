import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Assignment, DeliveryPartner, Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Package } from 'lucide-react';

type ActiveAssignmentsProps = {
  assignments: Assignment[];
  orders: Order[];
  partners: DeliveryPartner[];
};

const ActiveAssignments = ({ assignments, orders, partners }: ActiveAssignmentsProps) => {
  const isMobile = useIsMobile();

  const sortedAssignments = [...assignments]
    .map((assignment) => ({
      ...assignment,
      timestamp: assignment.timestamp instanceof Date
        ? assignment.timestamp
        : new Date(assignment.timestamp),
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getOrderDisplay = (assignment: Assignment) => {
    const order = orders.find((o) => o._id === (assignment.orderId as any)?._id || o._id === assignment.orderId);
    return order ? order.orderNumber : ((assignment.orderId as any)?._id || assignment.orderId)?.toString()?.slice(0, 8) + '...';
  };

  const getPartnerDisplay = (assignment: Assignment) => {
    const partner = partners.find((p) => p._id === (assignment.partnerId as any)?._id || p._id === assignment.partnerId);
    return partner ? partner.name : ((assignment.partnerId as any)?._id || assignment.partnerId)?.toString()?.slice(0, 8) + '...';
  };

  const renderMobileAssignment = (assignment: Assignment, index: number) => {
    return (
      <Card key={index} className="mb-4">
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-sm text-muted-foreground">
                {new Date(assignment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="font-medium">{getOrderDisplay(assignment)}</div>
            </div>
            <Badge
              className={
                assignment.status === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }
            >
              {assignment.status}
            </Badge>
          </div>

          <div className="text-sm">
            <div><span className="font-medium">Partner:</span> {getPartnerDisplay(assignment)}</div>
            {assignment.reason && <div><span className="font-medium">Reason:</span> {assignment.reason}</div>}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDesktopView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Order #</TableHead>
          <TableHead>Partner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAssignments.map((assignment, index) => (
          <TableRow key={index}>
            <TableCell>
              {new Date(assignment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </TableCell>
            <TableCell>{getOrderDisplay(assignment)}</TableCell>
            <TableCell>{getPartnerDisplay(assignment)}</TableCell>
            <TableCell>
              <Badge
                className={
                  assignment.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                {assignment.status}
              </Badge>
            </TableCell>
            <TableCell>{assignment.reason || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderEmptyState = () => (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <div className="bg-muted/30 rounded-full p-3 mb-4">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No assignments yet</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Run the assignment algorithm to assign orders to partners
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedAssignments.length === 0 ? (
          renderEmptyState()
        ) : isMobile ? (
          <div className="space-y-4">
            {sortedAssignments.map((assignment, index) =>
              renderMobileAssignment(assignment, index)
            )}
          </div>
        ) : (
          renderDesktopView()
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveAssignments;
