import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, AlertTriangle, X, ShoppingBag, Heart, Loader2 } from 'lucide-react';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error' | 'bell' | 'cart' | 'wishlist' | 'pending';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onRetry?: () => void | Promise<void>;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  updateToast: (id: string, updates: Partial<ToastItem>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, description, variant = 'success', duration = 4000, onRetry }: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, title, description, variant, duration, onRetry };
    
    setToasts((prev) => [...prev, newToast].slice(-5)); // Limit to max 5 concurrent toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const updateToast = useCallback((id: string, updates: Partial<ToastItem>) => {
    setToasts((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const merged = { ...t, ...updates };
          // If updates includes a new duration, register auto-remove
          if (updates.duration !== undefined && updates.duration > 0) {
            setTimeout(() => {
              removeToast(id);
            }, updates.duration);
          }
          return merged;
        }
        return t;
      })
    );
  }, [removeToast]);

  const getVariantColor = (variant: ToastVariant) => {
    switch (variant) {
      case 'success':
        return '#12B76A'; // Sophisticated emerald green
      case 'error':
        return '#F04438'; // Subtle premium ruby-crimson red
      case 'pending':
        return '#F79009'; // Energetic warm amber yellow
      case 'warning':
        return '#EAB308'; // Safety yellow
      case 'cart':
      case 'wishlist':
        return 'var(--coral)'; // Signature Kiosque Coral
      case 'info':
      default:
        return '#524E46'; // Slate charcoal grey
    }
  };

  const getVariantLabel = (variant: ToastVariant) => {
    switch (variant) {
      case 'success': return 'TRANSACTION SUCCESSFUL';
      case 'error': return 'ALERT EXCEPTION';
      case 'warning': return 'RESOURCE WARNING';
      case 'pending': return 'OPERATION PENDING';
      case 'cart': return 'ORDER BAG UPDATED';
      case 'wishlist': return 'ATELIER SAVED';
      case 'info': default: return 'NOTICE';
    }
  };

  const getIcon = (variant: ToastVariant) => {
    const color = getVariantColor(variant);
    switch (variant) {
      case 'success':
        return <Check size={15} strokeWidth={2.8} style={{ color }} />;
      case 'pending':
        return <Loader2 className="animate-spin" size={15} strokeWidth={2.8} style={{ color }} />;
      case 'cart':
        return <ShoppingBag size={15} strokeWidth={2.5} style={{ color }} />;
      case 'wishlist':
        return <Heart size={15} strokeWidth={2.5} style={{ color }} />;
      case 'warning':
        return <AlertTriangle size={15} strokeWidth={2.5} style={{ color }} />;
      case 'error':
        return <X size={15} strokeWidth={2.8} style={{ color }} />;
      case 'info':
      default:
        return <Info size={15} strokeWidth={2.5} style={{ color }} />;
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, updateToast, removeToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div 
        id="toast-container" 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          pointerEvents: 'none'
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const variantColor = getVariantColor(t.variant || 'success');
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  pointerEvents: 'auto',
                  background: 'var(--cream-soft)',
                  border: '1px solid var(--hairline-strong, var(--hairline))',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '14px',
                  alignItems: 'start',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Highlight bar with the Kiosque accent color */}
                <div 
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: variantColor
                  }}
                />

                {/* Icon slot */}
                <div 
                  style={{ 
                    marginTop: '2px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--cream)',
                    border: '1px solid var(--hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {getIcon(t.variant || 'success')}
                </div>

                {/* Text metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {/* Subtle top metadata stamp in Fira Code (var(--mono)) font */}
                  <div 
                    style={{ 
                      fontFamily: 'var(--mono)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: variantColor,
                      textTransform: 'uppercase',
                      opacity: 0.9,
                      lineHeight: 1
                    }}
                  >
                    {getVariantLabel(t.variant || 'success')}
                  </div>
                  
                  {/* Heading styled with Outfit (var(--sans)) font */}
                  <div 
                    style={{ 
                      fontFamily: 'var(--sans)',
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: 'var(--ink)', 
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3
                    }}
                  >
                    {t.title}
                  </div>
                  
                  {/* Description body styled with Outfit (var(--sans)) font */}
                  {t.description && (
                    <div 
                      style={{ 
                        fontFamily: 'var(--sans)',
                        fontSize: '12px', 
                        color: 'var(--grey-ink)', 
                        opacity: 0.9,
                        lineHeight: 1.45,
                        marginTop: '1px'
                      }}
                    >
                      {t.description}
                    </div>
                  )}

                  {t.onRetry && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        // Store refer before removing
                        const currentRetry = t.onRetry;
                        removeToast(t.id);
                        if (currentRetry) {
                          try {
                            await currentRetry();
                          } catch (err) {
                            console.error("Toast retry error:", err);
                          }
                        }
                      }}
                      style={{
                        marginTop: '10px',
                        padding: '6px 14px',
                        background: 'var(--ink)',
                        color: 'var(--cream)',
                        fontFamily: 'var(--mono)',
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        borderRadius: '999px',
                        border: 'none',
                        cursor: 'pointer',
                        width: 'fit-content',
                        transition: 'transform 0.1s ease',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                    >
                      Retry Action ↺
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => removeToast(t.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    color: 'var(--grey)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    marginTop: '1px'
                  }}
                  className="hover-bg-soft"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
