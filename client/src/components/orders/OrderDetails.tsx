
import React from 'react';
import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type OrderDetailsProps = {
  order: Order;
  partnerName: string;
};

const OrderDetails = ({ order, partnerName }: OrderDetailsProps) => {
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

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden px-1 sm:px-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <div className="text-xl font-bold">{order.orderNumber}</div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}
          </div>
        </div>
        <Badge className={getStatusBadgeColor(order.status)}>
          {order.status}
        </Badge>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Customer Information</h3>
        <div className="bg-muted p-3 rounded-md">
          <div className="font-medium">{order.customer.name}</div>
          <div className="text-sm">{order.customer.phone}</div>
          <div className="text-sm mt-1 break-words">{order.customer.address}</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Order Details</h3>
        <div className="bg-muted p-3 rounded-md">
          <div className="flex justify-between mb-1">
            <span>Area:</span>
            <span>{order.area}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Scheduled For:</span>
            <span>{order.scheduledFor}</span>
          </div>
          <div className="flex justify-between">
            <span>Assigned To:</span>
            <span className="break-words text-right">{partnerName}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Items</h3>
        <div className="bg-muted p-3 rounded-md overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead>
              <tr className="text-xs text-left">
                <th>Item</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="text-sm">
                  <td className="py-1 pr-2">{item.name}</td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">${item.price.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-300">
                <td colSpan={2} className="pt-2 font-medium">Total:</td>
                <td className="text-right pt-2 font-medium">${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
