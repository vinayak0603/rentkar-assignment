
export type DeliveryPartner = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  currentLoad: number; // max: 3
  areas: string[];
  shift: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
};

export type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string; // HH:mm
  assignedTo?: string; // partner ID
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Assignment = {
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  reason?: string;
};

export type AssignmentMetrics = {
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  failureReasons: {
    reason: string;
    count: number;
  }[];
};

export type PartnersPageProps = {
  partners: DeliveryPartner[];
  metrics: {
    totalActive: number;
    avgRating: number;
    topAreas: string[];
  };
};

export type OrdersPageProps = {
  orders: Order[];
  filters: {
    status: string[];
    areas: string[];
    date: string;
  };
};

export type AssignmentPageProps = {
  activeAssignments: Assignment[];
  metrics: AssignmentMetrics;
  partners: {
    available: number;
    busy: number;
    offline: number;
  };
};
