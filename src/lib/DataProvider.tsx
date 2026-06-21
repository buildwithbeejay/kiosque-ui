import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchVendors, fetchJournal, fetchConstants, fetchUserData, fetchUserDashboardData, registerSyncListener } from './api';

export const DataContext = createContext<any>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Live matching states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<'Synced' | 'Syncing...' | 'Offline'>(
    navigator.onLine ? 'Synced' : 'Offline'
  );

  useEffect(() => {
    // Register sync observer tracking all REST API requests automatically
    const unsubscribe = registerSyncListener((status) => {
      setSyncStatus(status);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const refreshUserData = useCallback(async () => {
    try {
      const refreshed = await fetchUserData();
      setCurrentUser(refreshed.CURRENT_USER);
      setOrders(refreshed.ORDERS);
      setSaved(refreshed.SAVED);
      setAddresses(refreshed.ADDRESSES);
      setPaymentMethods(refreshed.PAYMENT_METHODS);
      setFollowing(refreshed.FOLLOWING || []);
      setNotificationPrefs(refreshed.NOTIFICATION_PREFS);
    } catch (e) {
      console.warn("Could not dynamically reload user data:", e);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [products, vendors, journal, constants, userData, dashboardData] = await Promise.all([
          fetchProducts(),
          fetchVendors(),
          fetchJournal(),
          fetchConstants(),
          fetchUserData(),
          fetchUserDashboardData()
        ]);
        
        setData({
          PRODUCTS: products,
          VENDORS: vendors,
          JOURNAL: journal,
          ...constants,
          ...dashboardData
        });

        // Initialize active live database mock states
        setCurrentUser(userData.CURRENT_USER);
        setOrders(userData.ORDERS ?? []);
        setSaved(userData.SAVED ?? []);
        setAddresses(userData.ADDRESSES ?? []);
        setPaymentMethods(userData.PAYMENT_METHODS ?? []);
        setFollowing(userData.FOLLOWING ?? []);
        setNotificationPrefs(userData.NOTIFICATION_PREFS ?? []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--sans)" }}>
        Loading experience...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, paddingTop: 100, color: "var(--coral)", fontFamily: "var(--sans)" }}>
        Failed to connect to API server: {error.message}
      </div>
    );
  }

  // Combine static data with reactive state so no existing code breaks
  const mergedContextValue = {
    ...data,
    CURRENT_USER: currentUser,
    ORDERS: orders,
    SAVED: saved,
    ADDRESSES: addresses,
    PAYMENT_METHODS: paymentMethods,
    FOLLOWING: following,
    NOTIFICATION_PREFS: notificationPrefs,
    syncStatus,
    refreshUserData,
    setCurrentUser,
    setOrders,
    setSaved,
    setAddresses,
    setPaymentMethods,
    setFollowing,
    setNotificationPrefs
  };

  return (
    <DataContext.Provider value={mergedContextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  return useContext(DataContext);
}
