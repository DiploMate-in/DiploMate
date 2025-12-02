import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem, Purchase } from '@/types';

type AppContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  wishlist: string[];
  purchases: Purchase[];
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  toggleWishlist: (itemId: string) => Promise<void>;
  isInWishlist: (itemId: string) => boolean;
  addPurchase: (item: ContentItem) => Promise<void>;
  getPurchasedItem: (itemId: string) => Purchase | undefined;
  refreshUserData: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const isAuthenticated = !!session;

  // Fetch user's wishlist and purchases
  const refreshUserData = async () => {
    if (!session?.user) {
      setWishlist([]);
      setPurchases([]);
      return;
    }

    // Fetch wishlist
    const { data: wishlistData } = await supabase
      .from('wishlist')
      .select('content_item_id')
      .eq('user_id', session.user.id);

    if (wishlistData) {
      setWishlist(wishlistData.map(w => w.content_item_id));
    }

    // Fetch purchases
    const { data: purchasesData } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', session.user.id);

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
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);

        // Defer data fetching to avoid deadlock
        if (newSession?.user) {
          setTimeout(() => {
            refreshUserData();
          }, 0);
        } else {
          setWishlist([]);
          setPurchases([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setIsLoading(false);

      if (existingSession?.user) {
        refreshUserData();
      }
    });

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
    if (!session?.user) return;

    const inWishlist = wishlist.includes(itemId);

    if (inWishlist) {
      // Remove from wishlist
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', session.user.id)
        .eq('content_item_id', itemId);

      setWishlist(prev => prev.filter(id => id !== itemId));
    } else {
      // Add to wishlist
      await supabase
        .from('wishlist')
        .insert({
          user_id: session.user.id,
          content_item_id: itemId,
        });

      setWishlist(prev => [...prev, itemId]);
    }
  };

  const isInWishlist = (itemId: string) => wishlist.includes(itemId);

  const addPurchase = async (item: ContentItem) => {
    if (!session?.user) return;

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

    if (!error && data) {
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
