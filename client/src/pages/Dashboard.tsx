
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Package, Users, Clock, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { orderAPI, partnerAPI, assignmentAPI } from '@/services/api';
import { Order, DeliveryPartner, Assignment } from '@/types';

const Dashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [metrics, setMetrics] = useState({
    activeOrders: 0,
    availablePartners: 0,
    avgDeliveryTime: '0 min',
    successRate: '0%'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersData, partnersData, assignmentsData] = await Promise.all([
          orderAPI.getOrders(),
          partnerAPI.getPartners(),
          assignmentAPI.getAssignments()
        ]);

        setOrders(ordersData);
        setPartners(partnersData);
        setAssignments(assignmentsData);

        // Calculate metrics
        const activeOrders = ordersData.filter(o => 
          o.status === 'pending' || o.status === 'assigned' || o.status === 'picked'
        ).length;
        const availablePartners = partnersData.filter(p => 
          p.status === 'active' && p.currentLoad < 3
        ).length;
        
        // Use mock data for now
        const avgDeliveryTime = '28 min';
        const successfulAssignments = assignmentsData.filter(a => a.status === 'success').length;
        const successRate = assignmentsData.length > 0 
          ? `${((successfulAssignments / assignmentsData.length) * 100).toFixed(1)}%` 
          : '0%';

        setMetrics({
          activeOrders,
          availablePartners,
          avgDeliveryTime,
          successRate
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  //const handleNewOrder = () => {
     //Navigate to create order page or open modal
    //toast({
      //title: 'Create Order',
     // description: 'Opening order creation form'
   // });
  //};

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Delivery Management System</h1>
            <p className="text-gray-500">Manage your delivery partners and orders</p>
          </div>
          {/*<Button onClick={handleNewOrder}>New Order</Button>*/}
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeOrders}</div>
              <p className="text-xs text-muted-foreground">
                {orders.filter(o => o.status === 'pending').length} orders pending assignment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Partners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.availablePartners}</div>
              <p className="text-xs text-muted-foreground">
                {partners.filter(p => p.currentLoad > 0 && p.status === 'active').length} partners on delivery
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Delivery Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgDeliveryTime}</div>
              <p className="text-xs text-muted-foreground">2 min faster than yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assignment Success Rate</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.successRate}</div>
              <p className="text-xs text-muted-foreground">Based on last 100 assignments</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Partner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 5).map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{order.area}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'picked' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.assignedTo 
                          ? partners.find(p => p._id === order.assignedTo)?.name || '-'
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Partner Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Active Partners */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Active</span>
                    <span className="text-sm text-muted-foreground">
                      {partners.filter(p => p.status === 'active').length} 
                      ({Math.round((partners.filter(p => p.status === 'active').length / partners.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{
                        width: `${(partners.filter(p => p.status === 'active').length / partners.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* On Delivery */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">On Delivery</span>
                    <span className="text-sm text-muted-foreground">
                      {partners.filter(p => p.status === 'active' && p.currentLoad > 0).length}
                      ({Math.round((partners.filter(p => p.status === 'active' && p.currentLoad > 0).length / partners.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{
                        width: `${(partners.filter(p => p.status === 'active' && p.currentLoad > 0).length / partners.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Offline */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Offline</span>
                    <span className="text-sm text-muted-foreground">
                      {partners.filter(p => p.status === 'inactive').length}
                      ({Math.round((partners.filter(p => p.status === 'inactive').length / partners.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gray-500 h-2.5 rounded-full" 
                      style={{
                        width: `${(partners.filter(p => p.status === 'inactive').length / partners.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Delivery Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {/* Calculate the most common areas from orders */}
                {['Downtown', 'Westside', 'Eastside', 'Suburbs', 'Uptown'].map((area, index) => {
                  const orderCount = orders.filter(o => o.area === area).length;
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                  
                  return (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${colors[index]} rounded-full mr-2`}></div>
                        <span>{area}</span>
                      </div>
                      <span className="text-sm font-medium">{orderCount} orders</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
