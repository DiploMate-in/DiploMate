import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, ContentItem, Purchase } from '@/types';
import { mockPurchases, mockWishlist, contentItems } from '@/data/mockData';

type AppContextType = {
  user: User | null;
  isAuthenticated: boolean;
  wishlist: string[];
  purchases: Purchase[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  toggleWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  addPurchase: (item: ContentItem) => void;
  getPurchasedItem: (itemId: string) => Purchase | undefined;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const isAuthenticated = user !== null;

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in production, connect to Supabase
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email && password) {
      setUser({
        id: 'user1',
        name: email.split('@')[0],
        email,
      });
      setWishlist(mockWishlist);
      setPurchases(mockPurchases);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setWishlist([]);
    setPurchases([]);
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - in production, connect to Supabase
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (name && email && password) {
      setUser({
        id: 'user1',
        name,
        email,
      });
      setWishlist([]);
      setPurchases([]);
      return true;
    }
    return false;
  };

  const toggleWishlist = (itemId: string) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isInWishlist = (itemId: string) => wishlist.includes(itemId);

  const addPurchase = (item: ContentItem) => {
    const newPurchase: Purchase = {
      id: `p${Date.now()}`,
      userId: user?.id || 'guest',
      contentItemId: item.id,
      price: item.price,
      status: 'completed',
      purchasedAt: new Date().toISOString(),
      downloadsRemaining: item.downloadsAllowed,
    };
    setPurchases(prev => [...prev, newPurchase]);
  };

  const getPurchasedItem = (itemId: string) => 
    purchases.find(p => p.contentItemId === itemId);

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      wishlist,
      purchases,
      login,
      logout,
      signup,
      toggleWishlist,
      isInWishlist,
      addPurchase,
      getPurchasedItem,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
