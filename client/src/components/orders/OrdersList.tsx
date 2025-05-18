
import React, { useState } from 'react';
import { Order, DeliveryPartner } from '@/types';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Edit, Check, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import OrderDetails from './OrderDetails';

type OrdersListProps = {
  orders: Order[];
  partners: DeliveryPartner[];
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
  onAssignOrder: (orderId: string, partnerId: string) => void;
};

const OrdersList = ({ 
  orders, 
  partners, 
  onStatusUpdate, 
  onAssignOrder 
}: OrdersListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Get unique areas from orders
  const areas = Array.from(new Set(orders.map(order => order.area)));

  // Apply filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesArea = areaFilter === 'all' || order.area === areaFilter;
    
    return matchesSearch && matchesStatus && matchesArea;
  });

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const availablePartners = partners.filter(p => 
    p.status === 'active' && p.currentLoad < 3
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orders</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="w-48">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="picked">Picked</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <Select 
              value={areaFilter} 
              onValueChange={setAreaFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <div className="font-medium">{order.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{order.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{order.customer.phone}</div>
                </TableCell>
                <TableCell>{order.area}</TableCell>
                <TableCell>{order.scheduledFor}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.assignedTo 
                    ? partners.find(p => p._id === order.assignedTo)?.name || '-'
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {order.status === 'pending' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center text-xs"
                          >
                            <Package className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Order to Partner</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-1">Order Details</p>
                              <div className="text-sm">
                                <p><span className="font-medium">Order:</span> {order.orderNumber}</p>
                                <p><span className="font-medium">Customer:</span> {order.customer.name}</p>
                                <p><span className="font-medium">Area:</span> {order.area}</p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-1">Select Partner</p>
                              {availablePartners.length > 0 ? (
                                <Select
                                  onValueChange={(partnerId) => onAssignOrder(order._id, partnerId)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a partner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availablePartners.map(partner => (
                                      <SelectItem 
                                        key={partner._id} 
                                        value={partner._id || ''}
                                        disabled={!partner.areas.includes(order.area)}
                                      >
                                        {partner.name} 
                                        {partner.areas.includes(order.area) 
                                          ? ` (Load: ${partner.currentLoad}/3)` 
                                          : ' - Area not covered'
                                        }
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <p className="text-sm text-red-500">No available partners at the moment</p>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {order.status === 'assigned' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-xs"
                        onClick={() => onStatusUpdate(order._id, 'picked')}
                      >
                        <Package className="h-3 w-3 mr-1" />
                        Mark Picked
                      </Button>
                    )}
                    
                    {order.status === 'picked' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-xs"
                        onClick={() => onStatusUpdate(order._id, 'delivered')}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <OrderDetails 
              order={selectedOrder} 
              partnerName={
                selectedOrder.assignedTo
                  ? partners.find(p => p._id === selectedOrder.assignedTo)?.name || 'Unknown'
                  : 'Not Assigned'
              } 
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default OrdersList;
