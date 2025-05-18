
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Order } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from 'lucide-react';

// Define schema for order item
const orderItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
});

// Define the form schema with Zod
const orderFormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(1, 'Phone number is required'),
  customerAddress: z.string().min(1, 'Address is required'),
  area: z.string().min(1, 'Area is required'),
  scheduledFor: z.string().min(1, 'Scheduled time is required'),
  // Items will be managed separately
});

type CreateOrderFormProps = {
  areas: string[];
  onSubmit: (orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) => void;
};

const CreateOrderForm = ({ areas, onSubmit }: CreateOrderFormProps) => {
  const [items, setItems] = useState<Array<z.infer<typeof orderItemSchema>>>([
    { name: '', quantity: 1, price: 0 }
  ]);
  
  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      area: '',
      scheduledFor: '',
    },
  });

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof z.infer<typeof orderItemSchema>, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleSubmit = (values: z.infer<typeof orderFormSchema>) => {
    // Validate items
    let validItems = true;
    let totalAmount = 0;
    
    for (const item of items) {
      if (!item.name || item.quantity < 1 || item.price <= 0) {
        validItems = false;
        break;
      }
      totalAmount += item.quantity * item.price;
    }
    
    if (!validItems) {
      form.setError('root', { 
        message: 'Please check all order items. Names, quantities, and prices are required.' 
      });
      return;
    }

    // Generate order number
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create order
    const orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'> = {
      orderNumber,
      customer: {
        name: values.customerName,
        phone: values.customerPhone,
        address: values.customerAddress,
      },
      area: values.area,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      status: 'pending',
      scheduledFor: values.scheduledFor,
      totalAmount,
    };

    onSubmit(orderData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 w-full overflow-x-hidden">
        <div>
          <h3 className="text-lg font-medium mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="555-123-4567" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123 Main St, Anytown, USA" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Order Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduledFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Time</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-end">
                <div className="flex-grow w-full sm:w-auto">
                  <FormLabel className={index !== 0 ? 'sr-only' : ''}>Item Name</FormLabel>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    placeholder="Item name"
                    className="w-full"
                  />
                </div>
                <div className="w-full sm:w-20">
                  <FormLabel className={index !== 0 ? 'sr-only' : ''}>Qty</FormLabel>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full"
                  />
                </div>
                <div className="w-full sm:w-24">
                  <FormLabel className={index !== 0 ? 'sr-only' : ''}>Price</FormLabel>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    step={0.01}
                    min={0}
                    className="w-full"
                  />
                </div>
                <div className="self-end mt-2 sm:mt-0">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Order Summary</h3>
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-medium">${
                items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)
              }</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">Create Order</Button>
      </form>
    </Form>
  );
};

export default CreateOrderForm;
