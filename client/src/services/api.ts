
import { DeliveryPartner, Order, Assignment, AssignmentMetrics } from '@/types';
import { toast } from '@/hooks/use-toast';

// Base URL for API calls - set to your backend server URL
const BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    toast({
      title: "Error",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// Partner APIs
export const partnerAPI = {
  getPartners: async (): Promise<DeliveryPartner[]> => {
    try {
      const response = await fetch(`${BASE_URL}/partners`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch partners",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  createPartner: async (partner: DeliveryPartner): Promise<DeliveryPartner> => {
    try {
      const response = await fetch(`${BASE_URL}/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partner),
      });
      const result = await handleResponse(response);
      toast({
        title: "Success",
        description: "Partner created successfully",
      });
      return result;
    } catch (error) {
      console.error('Error creating partner:', error);
      toast({
        title: "Error",
        description: "Failed to create partner",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  updatePartner: async (id: string, partner: DeliveryPartner): Promise<DeliveryPartner> => {
    try {
      const response = await fetch(`${BASE_URL}/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partner),
      });
      const result = await handleResponse(response);
      toast({
        title: "Success",
        description: "Partner updated successfully",
      });
      return result;
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: "Error",
        description: "Failed to update partner",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  deletePartner: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/partners/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
      toast({
        title: "Success",
        description: "Partner deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: "Error",
        description: "Failed to delete partner",
        variant: "destructive",
      });
      throw error;
    }
  },
};

// Order APIs
export const orderAPI = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${BASE_URL}/orders`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  createOrder: async (order: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      const result = await handleResponse(response);
      toast({
        title: "Success",
        description: "Order created successfully",
      });
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await handleResponse(response);
      toast({
        title: "Success",
        description: `Order status updated to ${status}`,
      });
      return result;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  assignOrder: async (orderId: string, partnerId: string): Promise<Assignment> => {
    try {
      const response = await fetch(`${BASE_URL}/orders/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, partnerId }),
      });
      const result = await handleResponse(response);
      toast({
        title: "Success",
        description: "Order assigned successfully",
      });
      return result.assignment;
    } catch (error) {
      console.error('Error assigning order:', error);
      toast({
        title: "Error",
        description: "Failed to assign order",
        variant: "destructive",
      });
      throw error;
    }
  },
};

// Assignment APIs
export const assignmentAPI = {
  getAssignments: async (): Promise<Assignment[]> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  getMetrics: async (): Promise<AssignmentMetrics> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/metrics`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching assignment metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assignment metrics",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  runAssignment: async (): Promise<Assignment[]> => {
    try {
      const response = await fetch(`${BASE_URL}/assignments/run`, {
        method: 'POST',
      });
      const result = await handleResponse(response);
      toast({
        title: "Success",
        description: `${result.assignments.filter((a: Assignment) => a.status === 'success').length} orders assigned successfully`,
      });
      return result.assignments;
    } catch (error) {
      console.error('Error running assignments:', error);
      toast({
        title: "Error",
        description: "Failed to run assignments",
        variant: "destructive",
      });
      throw error;
    }
  },
};
