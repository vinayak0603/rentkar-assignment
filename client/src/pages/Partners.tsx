
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PartnersList from '@/components/partners/PartnersList';
import { partnerAPI } from '@/services/api';
import { DeliveryPartner } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Partners = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalActive: 0,
    avgRating: 0,
    topAreas: [] as string[],
  });

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const partnersData = await partnerAPI.getPartners();
        setPartners(partnersData);
        
        // Calculate metrics
        const activePartners = partnersData.filter(p => p.status === 'active');
        const totalActive = activePartners.length;
        
        const totalRating = partnersData.reduce((sum, partner) => sum + partner.metrics.rating, 0);
        const avgRating = partnersData.length > 0 ? (totalRating / partnersData.length) : 0;
        
        // Calculate top areas
        const areaCount: Record<string, number> = {};
        partnersData.forEach(partner => {
          partner.areas.forEach(area => {
            areaCount[area] = (areaCount[area] || 0) + 1;
          });
        });
        
        const topAreas = Object.entries(areaCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([area]) => area);
        
        setMetrics({
          totalActive,
          avgRating,
          topAreas,
        });
      } catch (error) {
        console.error('Error fetching partners:', error);
        toast({
          title: 'Error',
          description: 'Failed to load partners data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartners();
  }, [toast]);

  const handleUpdatePartner = async (partner: DeliveryPartner) => {
    try {
      if (!partner._id) return;
      
      await partnerAPI.updatePartner(partner._id, partner);
      
      setPartners(current => 
        current.map(p => p._id === partner._id ? partner : p)
      );
      
      // Update metrics
      const updatedPartners = partners.map(p => p._id === partner._id ? partner : p);
      updateMetrics(updatedPartners);
      
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update partner',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePartner = async (partner: DeliveryPartner) => {
    try {
      const newPartner = await partnerAPI.createPartner(partner);
      
      setPartners(current => [...current, newPartner]);
      
      // Update metrics
      const updatedPartners = [...partners, newPartner];
      updateMetrics(updatedPartners);
      
    } catch (error) {
      console.error('Error creating partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to create partner',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePartner = async (id: string) => {
    try {
      await partnerAPI.deletePartner(id);
      
      setPartners(current => 
        current.filter(p => p._id !== id)
      );
      
      // Update metrics
      const updatedPartners = partners.filter(p => p._id !== id);
      updateMetrics(updatedPartners);
      
      toast({
        title: 'Success',
        description: 'Partner deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete partner',
        variant: 'destructive',
      });
    }
  };

  const updateMetrics = (partnersData: DeliveryPartner[]) => {
    const activePartners = partnersData.filter(p => p.status === 'active');
    const totalActive = activePartners.length;
    
    const totalRating = partnersData.reduce((sum, partner) => sum + partner.metrics.rating, 0);
    const avgRating = partnersData.length > 0 ? (totalRating / partnersData.length) : 0;
    
    // Calculate top areas
    const areaCount: Record<string, number> = {};
    partnersData.forEach(partner => {
      partner.areas.forEach(area => {
        areaCount[area] = (areaCount[area] || 0) + 1;
      });
    });
    
    const topAreas = Object.entries(areaCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([area]) => area);
    
    setMetrics({
      totalActive,
      avgRating,
      topAreas,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
        <p className="text-muted-foreground">Manage your delivery partners</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalActive}</div>
            <p className="text-xs text-muted-foreground">
              {partners.length > 0 
                ? `${Math.round((metrics.totalActive / partners.length) * 100)}% of total partners`
                : '0% of total partners'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{metrics.avgRating.toFixed(1)}</div>
              <div className="text-yellow-500 ml-2">★</div>
            </div>
            <p className="text-xs text-muted-foreground">Based on all partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {metrics.topAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-primary' : 
                    index === 1 ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <PartnersList 
        partners={partners}
        onPartnerUpdate={handleUpdatePartner}
        onPartnerCreate={handleCreatePartner}
        onPartnerDelete={handleDeletePartner}
      />
    </div>
  );
};

export default Partners;
