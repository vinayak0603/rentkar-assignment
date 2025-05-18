import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrdersList from '@/components/orders/OrdersList';
import CreateOrderForm from '@/components/orders/CreateOrderForm';
import { orderAPI, partnerAPI } from '@/services/api';
import { Order, DeliveryPartner } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [filters, setFilters] = useState({
    status: ['pending', 'assigned', 'picked', 'delivered'],
    areas: [] as string[],
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, partnersData] = await Promise.all([
          orderAPI.getOrders(),
          partnerAPI.getPartners(),
        ]);
        
        setOrders(ordersData);
        setPartners(partnersData);
        
        // Extract areas from orders
        const areas = Array.from(new Set(ordersData.map(order => order.area)));
        setFilters(prev => ({ ...prev, areas }));
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleCreateOrder = async (orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newOrder = await orderAPI.createOrder(orderData);
      setOrders(current => [newOrder, ...current]);
      setIsCreatingOrder(false);
      
      toast({
        title: 'Success',
        description: 'Order created successfully',
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create order',
        variant: 'destructive',
      });
    }
  };

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrder = await orderAPI.updateOrderStatus(orderId, status);
      
      // If order was delivered, update partner's load
      if (status === 'delivered' && updatedOrder.assignedTo) {
        const partner = partners.find(p => p._id === updatedOrder.assignedTo);
        if (partner && partner.currentLoad > 0) {
          const updatedPartner = { 
            ...partner, 
            currentLoad: partner.currentLoad - 1,
            metrics: {
              ...partner.metrics,
              completedOrders: partner.metrics.completedOrders + 1
            }
          };
          
          await partnerAPI.updatePartner(partner._id!, updatedPartner);
          
          // Update partners state
          setPartners(current => 
            current.map(p => p._id === partner._id ? updatedPartner : p)
          );
        }
      }
      
      // Update orders state
      setOrders(current => 
        current.map(o => o._id === orderId ? updatedOrder : o)
      );
      
      toast({
        title: 'Success',
        description: `Order status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const handleAssignOrder = async (orderId: string, partnerId: string) => {
    try {
      const assignment = await orderAPI.assignOrder(orderId, partnerId);
      
      if (assignment.status === 'success') {
        // Update orders state
        const updatedOrder = orders.find(o => o._id === orderId);
        if (updatedOrder) {
          updatedOrder.status = 'assigned';
          updatedOrder.assignedTo = partnerId;
          
          setOrders(current => 
            current.map(o => o._id === orderId ? updatedOrder : o)
          );
        }
        
        // Update partners state
        const partner = partners.find(p => p._id === partnerId);
        if (partner) {
          const updatedPartner = { 
            ...partner, 
            currentLoad: partner.currentLoad + 1 
          };
          
          setPartners(current => 
            current.map(p => p._id === partnerId ? updatedPartner : p)
          );
        }
        
        toast({
          title: 'Success',
          description: 'Order assigned successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: assignment.reason || 'Failed to assign order',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error assigning order:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign order',
        variant: 'destructive',
      });
    }
  };

  // Get unique areas from orders
  const areas = ['Sion', 'Matunga', 'Andheri', 'Powai', 'Bandra', 'Khar'];

  // Calculate metrics
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const assignedCount = orders.filter(o => o.status === 'assigned').length;
  const pickedCount = orders.filter(o => o.status === 'picked').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const totalCount = orders.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage your delivery orders</p>
        </div>
        <Dialog open={isCreatingOrder} onOpenChange={setIsCreatingOrder}>
          <Button onClick={() => setIsCreatingOrder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
          <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <CreateOrderForm 
              areas={areas} 
              onSubmit={handleCreateOrder}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-5 grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <div className="text-xs text-muted-foreground">
              {totalCount > 0 ? `${Math.round((pendingCount / totalCount) * 100)}%` : '0%'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedCount}</div>
            <div className="text-xs text-muted-foreground">
              {totalCount > 0 ? `${Math.round((assignedCount / totalCount) * 100)}%` : '0%'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Picked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pickedCount}</div>
            <div className="text-xs text-muted-foreground">
              {totalCount > 0 ? `${Math.round((pickedCount / totalCount) * 100)}%` : '0%'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredCount}</div>
            <div className="text-xs text-muted-foreground">
              {totalCount > 0 ? `${Math.round((deliveredCount / totalCount) * 100)}%` : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      <OrdersList 
        orders={orders}
        partners={partners}
        onStatusUpdate={handleStatusUpdate}
        onAssignOrder={handleAssignOrder}
      />
    </div>
  );
};

export default Orders;
