
import React, { useState } from 'react';
import { DeliveryPartner } from '@/types';
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
import { Edit, Search, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PartnerForm from './PartnerForm';

type PartnersListProps = {
  partners: DeliveryPartner[];
  onPartnerUpdate: (partner: DeliveryPartner) => void;
  onPartnerCreate: (partner: DeliveryPartner) => void;
  onPartnerDelete: (id: string) => void;
};

const PartnersList = ({ 
  partners, 
  onPartnerUpdate, 
  onPartnerCreate, 
  onPartnerDelete 
}: PartnersListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);

  const filteredPartners = partners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.phone.includes(searchTerm)
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Delivery Partners</CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
            <Button onClick={() => setShowNewForm(true)} className="w-full sm:w-auto">Add Partner</Button>
            <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
              </DialogHeader>
              <PartnerForm
                onSubmit={(partner) => {
                  onPartnerCreate(partner);
                  setShowNewForm(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Load</TableHead>
                <TableHead>Areas</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-xs text-muted-foreground">{partner.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={partner.status === 'active' ? 'default' : 'outline'}>
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 bg-muted h-2 rounded-full mr-2">
                        <div 
                          className={`h-2 rounded-full ${partner.currentLoad >= 3 ? 'bg-red-500' : 'bg-primary'}`}
                          style={{ width: `${(partner.currentLoad / 3) * 100}%` }}
                        ></div>
                      </div>
                      <span>{partner.currentLoad}/3</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {partner.areas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {partner.shift.start} - {partner.shift.end}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="text-yellow-500">★</div>
                      <span className="ml-1">{partner.metrics.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedPartner(partner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[95vw] sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete {partner.name} 
                              and remove their data from the system.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => partner._id && onPartnerDelete(partner._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={!!selectedPartner} onOpenChange={(isOpen) => !isOpen && setSelectedPartner(null)}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <PartnerForm 
              partner={selectedPartner} 
              onSubmit={(partner) => {
                onPartnerUpdate(partner);
                setSelectedPartner(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PartnersList;
