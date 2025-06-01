
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  status: 'Available' | 'Rented' | 'Maintenance';
  description?: string;
}

export interface Rental {
  id: string;
  equipmentId: string;
  customerId: string;
  customerName: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  status: 'Reserved' | 'Rented' | 'Returned' | 'Overdue';
  totalCost?: number;
}

export interface Maintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  type: 'Routine Check' | 'Repair' | 'Overhaul' | 'Emergency';
  notes: string;
  cost?: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface DataContextType {
  equipment: Equipment[];
  rentals: Rental[];
  maintenance: Maintenance[];
  notifications: Notification[];
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addRental: (rental: Omit<Rental, 'id'>) => void;
  updateRental: (id: string, rental: Partial<Rental>) => void;
  addMaintenance: (maintenance: Omit<Maintenance, 'id'>) => void;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data as specified in requirements
const initialEquipment: Equipment[] = [
  { id: "eq1", name: "Excavator", category: "Heavy Machinery", condition: "Good", status: "Available", description: "Large hydraulic excavator for construction projects" },
  { id: "eq2", name: "Concrete Mixer", category: "Construction", condition: "Excellent", status: "Rented", description: "Professional concrete mixer for large projects" },
  { id: "eq3", name: "Bulldozer", category: "Heavy Machinery", condition: "Good", status: "Available", description: "Heavy-duty bulldozer for earthmoving" },
  { id: "eq4", name: "Crane", category: "Heavy Machinery", condition: "Excellent", status: "Available", description: "Mobile crane for lifting operations" },
  { id: "eq5", name: "Generator", category: "Power Equipment", condition: "Good", status: "Maintenance", description: "Portable diesel generator" }
];

const initialRentals: Rental[] = [
  { 
    id: "r1", 
    equipmentId: "eq2", 
    customerId: "3", 
    customerName: "Customer User",
    equipmentName: "Concrete Mixer",
    startDate: "2025-06-01", 
    endDate: "2025-06-05", 
    status: "Reserved",
    totalCost: 500
  },
  { 
    id: "r2", 
    equipmentId: "eq1", 
    customerId: "3", 
    customerName: "Customer User",
    equipmentName: "Excavator",
    startDate: "2025-05-25", 
    endDate: "2025-05-30", 
    status: "Overdue",
    totalCost: 1200
  }
];

const initialMaintenance: Maintenance[] = [
  { 
    id: "m1", 
    equipmentId: "eq1", 
    equipmentName: "Excavator",
    date: "2025-05-20", 
    type: "Routine Check", 
    notes: "No issues found",
    cost: 150
  },
  { 
    id: "m2", 
    equipmentId: "eq5", 
    equipmentName: "Generator",
    date: "2025-05-28", 
    type: "Repair", 
    notes: "Replaced air filter and spark plugs",
    cost: 85
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedEquipment = localStorage.getItem('equipment');
    const savedRentals = localStorage.getItem('rentals');
    const savedMaintenance = localStorage.getItem('maintenance');
    const savedNotifications = localStorage.getItem('notifications');

    setEquipment(savedEquipment ? JSON.parse(savedEquipment) : initialEquipment);
    setRentals(savedRentals ? JSON.parse(savedRentals) : initialRentals);
    setMaintenance(savedMaintenance ? JSON.parse(savedMaintenance) : initialMaintenance);
    setNotifications(savedNotifications ? JSON.parse(savedNotifications) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('rentals', JSON.stringify(rentals));
  }, [rentals]);

  useEffect(() => {
    localStorage.setItem('maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const equipment = { ...newEquipment, id: `eq${Date.now()}` };
    setEquipment(prev => [...prev, equipment]);
    addNotification({ 
      message: `New equipment "${equipment.name}" added to inventory`, 
      type: 'success',
      read: false 
    });
  };

  const updateEquipment = (id: string, updatedEquipment: Partial<Equipment>) => {
    setEquipment(prev => prev.map(eq => eq.id === id ? { ...eq, ...updatedEquipment } : eq));
  };

  const deleteEquipment = (id: string) => {
    const equipmentName = equipment.find(eq => eq.id === id)?.name;
    setEquipment(prev => prev.filter(eq => eq.id !== id));
    if (equipmentName) {
      addNotification({ 
        message: `Equipment "${equipmentName}" removed from inventory`, 
        type: 'info',
        read: false 
      });
    }
  };

  const addRental = (newRental: Omit<Rental, 'id'>) => {
    const rental = { ...newRental, id: `r${Date.now()}` };
    setRentals(prev => [...prev, rental]);
    addNotification({ 
      message: `New rental created for ${rental.equipmentName}`, 
      type: 'success',
      read: false 
    });
  };

  const updateRental = (id: string, updatedRental: Partial<Rental>) => {
    setRentals(prev => prev.map(r => r.id === id ? { ...r, ...updatedRental } : r));
    if (updatedRental.status === 'Returned') {
      const rental = rentals.find(r => r.id === id);
      if (rental) {
        addNotification({ 
          message: `${rental.equipmentName} has been returned`, 
          type: 'success',
          read: false 
        });
      }
    }
  };

  const addMaintenance = (newMaintenance: Omit<Maintenance, 'id'>) => {
    const maintenance = { ...newMaintenance, id: `m${Date.now()}` };
    setMaintenance(prev => [...prev, maintenance]);
    addNotification({ 
      message: `Maintenance scheduled for ${maintenance.equipmentName}`, 
      type: 'info',
      read: false 
    });
  };

  const updateMaintenance = (id: string, updatedMaintenance: Partial<Maintenance>) => {
    setMaintenance(prev => prev.map(m => m.id === id ? { ...m, ...updatedMaintenance } : m));
  };

  const addNotification = (newNotification: Omit<Notification, 'id' | 'timestamp'>) => {
    const notification = { 
      ...newNotification, 
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <DataContext.Provider value={{
      equipment,
      rentals,
      maintenance,
      notifications,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addRental,
      updateRental,
      addMaintenance,
      updateMaintenance,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
