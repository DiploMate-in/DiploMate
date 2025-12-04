import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem, Purchase } from '@/types';
import { toast } from 'sonner';

type AppContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDataLoading: boolean;
  wishlist: string[];
  purchases: Purchase[];
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  toggleWishlist: (itemId: string) => Promise<void>;
  isInWishlist: (itemId: string) => boolean;
  addPurchase: (item: ContentItem) => Promise<void>;
  getPurchasedItem: (itemId: string) => Purchase | undefined;
  refreshUserData: (userId?: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  
  // Ref to track the latest data fetch request to avoid race conditions
  const latestFetchIdRef = useRef<number>(0);

  const isAuthenticated = !!session?.user;

  // Fetch user's wishlist and purchases
  const refreshUserData = async (userId?: string) => {
    const currentUserId = userId || session?.user?.id;
    const fetchId = ++latestFetchIdRef.current;

    if (!currentUserId) {
      if (fetchId === latestFetchIdRef.current) {
        setWishlist([]);
        setPurchases([]);
        setIsDataLoading(false);
      }
      return;
    }

    setIsDataLoading(true);
    try {
      // Fetch wishlist
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select('content_item_id')
        .eq('user_id', currentUserId);

      if (wishlistError) throw wishlistError;

      // Fetch purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', currentUserId);

      if (purchasesError) throw purchasesError;

      // Only update state if this is still the latest request
      if (fetchId === latestFetchIdRef.current) {
        if (wishlistData) {
          setWishlist(wishlistData.map(w => w.content_item_id));
        }

        if (purchasesData) {
          setPurchases(purchasesData.map(p => ({
            id: p.id,
            userId: p.user_id,
            contentItemId: p.content_item_id,
            price: p.price,
            status: p.status as 'pending' | 'completed' | 'refunded',
            purchasedAt: p.purchased_at,
            downloadsRemaining: p.downloads_remaining,
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (fetchId === latestFetchIdRef.current) {
        toast.error('Failed to load user data');
      }
    } finally {
      if (fetchId === latestFetchIdRef.current) {
        setIsDataLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
      
      if (initialSession?.user) {
        refreshUserData(initialSession.user.id);
      } else {
        setIsDataLoading(false);
      }
    });

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);

        if (newSession?.user) {
          refreshUserData(newSession.user.id);
        } else {
          setWishlist([]);
          setPurchases([]);
          setIsDataLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setWishlist([]);
    setPurchases([]);
  };

  const signup = async (name: string, email: string, password: string): Promise<{ error: string | null }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const toggleWishlist = async (itemId: string) => {
    if (!session?.user) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    const inWishlist = wishlist.includes(itemId);

    try {
      if (inWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', session.user.id)
          .eq('content_item_id', itemId);

        if (error) throw error;

        setWishlist(prev => prev.filter(id => id !== itemId));
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: session.user.id,
            content_item_id: itemId,
          });

        if (error) throw error;

        setWishlist(prev => [...prev, itemId]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (itemId: string) => wishlist.includes(itemId);

  const addPurchase = async (item: ContentItem) => {
    if (!session?.user) {
      toast.error('Please login to purchase items');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: session.user.id,
          content_item_id: item.id,
          price: item.price,
          downloads_remaining: item.downloadsAllowed,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newPurchase: Purchase = {
          id: data.id,
          userId: data.user_id,
          contentItemId: data.content_item_id,
          price: data.price,
          status: data.status as 'pending' | 'completed' | 'refunded',
          purchasedAt: data.purchased_at,
          downloadsRemaining: data.downloads_remaining,
        };
        setPurchases(prev => [...prev, newPurchase]);
        toast.success('Purchase successful!');
      }
    } catch (error) {
      console.error('Error adding purchase:', error);
      toast.error('Failed to process purchase');
    }
  };

  const getPurchasedItem = (itemId: string) =>
    purchases.find(p => p.contentItemId === itemId);

  return (
    <AppContext.Provider value={{
      user,
      session,
      isAuthenticated,
      isLoading,
      isDataLoading,
      wishlist,
      purchases,
      login,
      logout,
      signup,
      toggleWishlist,
      isInWishlist,
      addPurchase,
      getPurchasedItem,
      refreshUserData,
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
