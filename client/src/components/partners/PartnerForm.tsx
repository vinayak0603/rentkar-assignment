
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DeliveryPartner } from '@/types';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

// Define the form schema with Zod
const partnerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  status: z.boolean(),
  areas: z.string().min(1, 'Areas are required'),
  shiftStart: z.string().min(1, 'Shift start time is required'),
  shiftEnd: z.string().min(1, 'Shift end time is required'),
});

type PartnerFormProps = {
  partner?: DeliveryPartner;
  onSubmit: (partner: DeliveryPartner) => void;
};

const PartnerForm = ({ partner, onSubmit }: PartnerFormProps) => {
  const form = useForm<z.infer<typeof partnerSchema>>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: partner?.name || '',
      email: partner?.email || '',
      phone: partner?.phone || '',
      status: partner ? partner.status === 'active' : true,
      areas: partner?.areas.join(', ') || '',
      shiftStart: partner?.shift.start || '09:00',
      shiftEnd: partner?.shift.end || '17:00',
    },
  });

  const handleSubmit = (values: z.infer<typeof partnerSchema>) => {
    // Transform form data to partner data
    const partnerData: DeliveryPartner = {
      _id: partner?._id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      status: values.status ? 'active' : 'inactive',
      currentLoad: partner?.currentLoad || 0,
      areas: values.areas.split(',').map(area => area.trim()),
      shift: {
        start: values.shiftStart,
        end: values.shiftEnd,
      },
      metrics: partner?.metrics || {
        rating: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      },
    };

    onSubmit(partnerData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full max-w-full overflow-hidden">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Smith" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="john@example.com" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="555-123-4567" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Partner is available for deliveries
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="areas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Areas</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Downtown, Midtown, Uptown (comma separated)" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shiftStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift Start</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shiftEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift End</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {partner ? 'Update Partner' : 'Add Partner'}
        </Button>
      </form>
    </Form>
  );
};

export default PartnerForm;
