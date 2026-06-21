// Sync status reporting system
let activeRequestsCount = 0;
const listeners = new Set<(status: 'Synced' | 'Syncing...' | 'Offline') => void>();

export function registerSyncListener(listener: (status: 'Synced' | 'Syncing...' | 'Offline') => void) {
  listeners.add(listener);
  listener(getSyncStatus());
  return () => {
    listeners.delete(listener);
  };
}

function getSyncStatus(): 'Synced' | 'Syncing...' | 'Offline' {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'Offline';
  return activeRequestsCount > 0 ? 'Syncing...' : 'Synced';
}

function notifyListeners() {
  const status = getSyncStatus();
  listeners.forEach(l => l(status));
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', notifyListeners);
  window.addEventListener('offline', notifyListeners);
}

async function localFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    notifyListeners();
  } else {
    activeRequestsCount++;
    notifyListeners();
  }
  try {
    const res = await fetch(input, init);
    return res;
  } finally {
    if (activeRequestsCount > 0) {
      activeRequestsCount--;
    }
    notifyListeners();
  }
}

export async function fetchProducts() {
  const res = await localFetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchVendors() {
  const res = await localFetch("/api/vendors");
  if (!res.ok) throw new Error("Failed to fetch vendors");
  return res.json();
}

export async function fetchJournal() {
  const res = await localFetch("/api/journal");
  if (!res.ok) throw new Error("Failed to fetch journal");
  return res.json();
}

export async function fetchConstants() {
  const res = await localFetch("/api/constants");
  if (!res.ok) throw new Error("Failed to fetch constants");
  return res.json();
}

export async function fetchUser() {
  const res = await localFetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchUserOrders() {
  const res = await localFetch("/api/user/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function fetchUserDashboardData() {
  const [vendorSession, sales, orders, catalog, payouts, analytics, messages, reviews] = await Promise.all([
    localFetch("/api/vendor/session").then(res => res.json()),
    localFetch("/api/vendor/sales").then(res => res.json()),
    localFetch("/api/vendor/orders").then(res => res.json()),
    localFetch("/api/vendor/catalog").then(res => res.json()),
    localFetch("/api/vendor/payouts").then(res => res.json()),
    localFetch("/api/vendor/analytics").then(res => res.json()),
    localFetch("/api/vendor/messages").then(res => res.json()),
    localFetch("/api/vendor/reviews").then(res => res.json()),
  ]);

  return { 
    VENDOR_SESSION: vendorSession, 
    VENDOR_SALES: sales, 
    VENDOR_ORDERS: orders, 
    VENDOR_CATALOG: catalog, 
    VENDOR_PAYOUTS: payouts, 
    VENDOR_ANALYTICS: analytics, 
    VENDOR_MESSAGES: messages, 
    VENDOR_REVIEWS: reviews 
  };
}

export async function fetchUserData() {
  const [currentUser, orders, saved, addresses, paymentMethods, following, notificationPrefs] = await Promise.all([
    localFetch("/api/user").then(res => res.json()),
    localFetch("/api/user/orders").then(res => res.json()),
    localFetch("/api/user/saved").then(res => res.json()),
    localFetch("/api/user/addresses").then(res => res.json()),
    localFetch("/api/user/payment-methods").then(res => res.json()),
    localFetch("/api/user/following").then(res => res.json()),
    localFetch("/api/user/notification-prefs").then(res => res.json()),
  ]);

  return { 
    CURRENT_USER: currentUser, 
    ORDERS: orders, 
    SAVED: saved, 
    ADDRESSES: addresses, 
    PAYMENT_METHODS: paymentMethods, 
    FOLLOWING: following, 
    NOTIFICATION_PREFS: notificationPrefs 
  };
}

// REST Backend Communication layer
export async function apiToggleSave(productId: string) {
  const res = await localFetch("/api/user/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error("Failed to save product on server");
  const data = await res.json();
  return data.saved;
}

export async function apiCreateOrder(order: any) {
  const res = await localFetch("/api/user/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });
  if (!res.ok) throw new Error("Failed to post order to server");
  const data = await res.json();
  return data.orders;
}

export async function apiTrackOrder(orderId: string) {
  const res = await localFetch("/api/order/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) throw new Error("Order lookup failed on server");
  const data = await res.json();
  return data.order;
}

export async function apiUpdateNotificationPrefs(prefs: any) {
  const res = await localFetch("/api/user/notification-prefs", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefs }),
  });
  if (!res.ok) throw new Error("Failed to sync notifications with server");
  const data = await res.json();
  return data.notificationPrefs;
}

export async function apiAddAddress(address: any) {
  const res = await localFetch("/api/user/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });
  if (!res.ok) throw new Error("Failed to write shipping address to server");
  const data = await res.json();
  return data.addresses;
}

export async function apiUpdateAddress(label: string, updates: any) {
  const res = await localFetch("/api/user/addresses", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, updates }),
  });
  if (!res.ok) throw new Error("Failed to modify shipping address on server");
  const data = await res.json();
  return data.addresses;
}

export async function apiDeleteAddress(label: string) {
  const res = await localFetch(`/api/user/addresses/${encodeURIComponent(label)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove address from server records");
  const data = await res.json();
  return data.addresses;
}

export async function apiAddPaymentMethod(method: any) {
  const res = await localFetch("/api/user/payment-methods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method }),
  });
  if (!res.ok) throw new Error("Failed to register checkout card on server");
  const data = await res.json();
  return data.paymentMethods;
}

export async function apiSignIn(email: string) {
  const res = await localFetch("/api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Authentication rejected by server security gateway");
  const data = await res.json();
  return data.user;
}

export async function apiSignOut() {
  await localFetch("/api/auth/sign-out", { method: "POST" });
}

export async function apiSignUp(email: string, name: string) {
  const res = await localFetch("/api/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) throw new Error("Sign up profile validation error");
  return res.json();
}

export async function apiOnboard(email: string, name: string, profile: any) {
  const res = await localFetch("/api/auth/onboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, profile }),
  });
  if (!res.ok) throw new Error("Handshake failed to persist onboard session on server");
  const data = await res.json();
  return data.user;
}

export async function apiVendorApply(data: any) {
  const res = await localFetch("/api/auth/vendor-apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Atelier listing registration error on backend");
  return res.json();
}
