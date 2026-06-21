import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Import data
import {
  VENDORS,
  PRODUCTS,
  HERO_IMG,
  JOURNAL_IMGS,
  JOURNAL,
  CATEGORIES,
  FILTERS,
  SIZES,
  CURRENT_USER,
  ORDERS,
  SAVED,
  ADDRESSES,
  PAYMENT_METHODS,
  FOLLOWING,
  NOTIFICATION_PREFS,
  VENDOR_SESSION,
  VENDOR_SALES,
  VENDOR_ORDERS,
  VENDOR_CATALOG,
  VENDOR_PAYOUTS,
  VENDOR_ANALYTICS,
  VENDOR_MESSAGES,
  VENDOR_REVIEWS,
} from "./src/lib/data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory backend state for live backend simulations
let dbUser: any = { ...CURRENT_USER };
let dbOrders: any[] = [...ORDERS];
let dbSaved: any[] = [...SAVED];
let dbAddresses: any[] = [...ADDRESSES];
let dbPaymentMethods: any[] = [...PAYMENT_METHODS];
let dbFollowing: any[] = [...FOLLOWING];
let dbNotificationPrefs: any[] = [...NOTIFICATION_PREFS];

async function startServer() {
  const app = express();
  const PORT = 5000;

  app.use(express.json());

  // === API ROUTES ===
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Storefront endpoints
  app.get("/api/products", (req, res) => res.json(PRODUCTS));
  app.get("/api/vendors", (req, res) => res.json(VENDORS));
  app.get("/api/journal", (req, res) => res.json(JOURNAL));
  app.get("/api/constants", (req, res) =>
    res.json({ HERO_IMG, JOURNAL_IMGS, CATEGORIES, FILTERS, SIZES }),
  );

  // User endpoints (dynamic in-memory state retrieval)
  app.get("/api/user", (req, res) => res.json(dbUser));
  app.get("/api/user/orders", (req, res) => res.json(dbOrders));
  app.get("/api/user/saved", (req, res) => res.json(dbSaved));
  app.get("/api/user/addresses", (req, res) => res.json(dbAddresses));
  app.get("/api/user/payment-methods", (req, res) =>
    res.json(dbPaymentMethods),
  );
  app.get("/api/user/following", (req, res) => res.json(dbFollowing));
  app.get("/api/user/notification-prefs", (req, res) =>
    res.json(dbNotificationPrefs),
  );

  // --- Dynamic Action Endpoints ---

  // Auth/Onboarding and profile simulations
  app.post("/api/auth/sign-in", (req, res) => {
    const { email } = req.body;
    dbUser = {
      email,
      name: email.split("@")[0].toUpperCase(),
      role: "buyer",
      onboarded: true,
      profile: {
        bio: "Appreciator of local ateliers",
        location: "Lagos, Nigeria",
        currency: "NGN",
      },
      signedInAt: Date.now(),
    };
    res.json({ success: true, user: dbUser });
  });

  app.post("/api/auth/sign-out", (req, res) => {
    dbUser = null;
    res.json({ success: true });
  });

  app.post("/api/auth/sign-up", (req, res) => {
    const { email, name } = req.body;
    res.json({ success: true, pendingEmail: email, pendingName: name });
  });

  app.post("/api/auth/verified", (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/auth/onboard", (req, res) => {
    const { email, name, profile } = req.body;
    dbUser = {
      email,
      name,
      role: "buyer",
      onboarded: true,
      profile,
      signedInAt: Date.now(),
    };
    res.json({ success: true, user: dbUser });
  });

  app.post("/api/auth/vendor-apply", (req, res) => {
    res.json({
      success: true,
      message:
        "Vendor application successfully registered on backend server database.",
    });
  });

  // Archive (Wishlist) updates
  app.post("/api/user/saved", (req, res) => {
    const { productId } = req.body;
    if (dbSaved.includes(productId)) {
      dbSaved = dbSaved.filter((id) => id !== productId);
    } else {
      dbSaved.push(productId);
    }
    res.json({ success: true, saved: dbSaved });
  });

  // Orders creation
  app.post("/api/user/orders", (req, res) => {
    const { order } = req.body;
    dbOrders = [order, ...dbOrders];
    res.json({ success: true, orders: dbOrders });
  });

  // Order Search/Lookup simulation
  app.post("/api/order/track", (req, res) => {
    const { orderId } = req.body;
    const matchingOrder = dbOrders.find(
      (o) => o.id?.toLowerCase() === orderId?.toLowerCase(),
    );
    if (matchingOrder) {
      res.json({ success: true, order: matchingOrder });
    } else {
      // Return a simulated mock found order if not in list
      const mockOrder = {
        id: orderId?.toUpperCase(),
        date: "Today",
        status: "In production",
        dest: "Lagos, NG",
        total: "₦ 145,000",
        items: [],
      };
      res.json({ success: true, order: mockOrder });
    }
  });

  // Notification Preference updates
  app.put("/api/user/notification-prefs", (req, res) => {
    const { prefs } = req.body;
    dbNotificationPrefs = prefs;
    res.json({ success: true, notificationPrefs: dbNotificationPrefs });
  });

  // Addresses addition, update & setting default
  app.post("/api/user/addresses", (req, res) => {
    const { address } = req.body;
    dbAddresses.push(address);
    res.json({ success: true, addresses: dbAddresses });
  });

  app.put("/api/user/addresses", (req, res) => {
    const { label, updates } = req.body;
    dbAddresses = dbAddresses.map((addr) =>
      addr.label === label ? { ...addr, ...updates } : addr,
    );
    res.json({ success: true, addresses: dbAddresses });
  });

  app.delete("/api/user/addresses/:label", (req, res) => {
    const { label } = req.params;
    dbAddresses = dbAddresses.filter((addr) => addr.label !== label);
    res.json({ success: true, addresses: dbAddresses });
  });

  // Payment Methods updates
  app.post("/api/user/payment-methods", (req, res) => {
    const { method } = req.body;
    dbPaymentMethods.push(method);
    res.json({ success: true, paymentMethods: dbPaymentMethods });
  });

  // Vendor Dashboard endpoints
  app.get("/api/vendor/session", (req, res) => res.json(VENDOR_SESSION));
  app.get("/api/vendor/sales", (req, res) => res.json(VENDOR_SALES));
  app.get("/api/vendor/orders", (req, res) => res.json(VENDOR_ORDERS));
  app.get("/api/vendor/catalog", (req, res) => res.json(VENDOR_CATALOG));
  app.get("/api/vendor/payouts", (req, res) => res.json(VENDOR_PAYOUTS));
  app.get("/api/vendor/analytics", (req, res) => res.json(VENDOR_ANALYTICS));
  app.get("/api/vendor/messages", (req, res) => res.json(VENDOR_MESSAGES));
  app.get("/api/vendor/reviews", (req, res) => res.json(VENDOR_REVIEWS));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
