'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
  dismissible?: boolean;
  createdAt: number;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'createdAt'>) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg: 'bg-green-900/90',
    border: 'border-green-500',
    icon: 'text-green-400',
    text: 'text-green-100',
  },
  error: {
    bg: 'bg-red-900/90',
    border: 'border-red-500',
    icon: 'text-red-400',
    text: 'text-red-100',
  },
  warning: {
    bg: 'bg-amber-900/90',
    border: 'border-amber-500',
    icon: 'text-amber-400',
    text: 'text-amber-100',
  },
  info: {
    bg: 'bg-cyan-900/90',
    border: 'border-cyan-500',
    icon: 'text-cyan-400',
    text: 'text-cyan-100',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id' | 'createdAt'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
      dismissible: toast.dismissible ?? true,
      createdAt: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAllToasts }}>
      {children}
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

export interface ToastContainerProps {
  position?: ToastPosition;
  maxToasts?: number;
}

export function ToastContainer({
  position = 'top-right',
  maxToasts = 5,
}: ToastContainerProps) {
  const { toasts, removeToast } = useToast();

  const positionClasses: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const visibleToasts = toasts.slice(-maxToasts);

  return (
    <div
      className={`fixed z-[200] flex flex-col gap-2 ${positionClasses[position]}`}
      aria-live="polite"
      aria-label="Notificações"
    >
      {visibleToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const styles = TOAST_STYLES[toast.type];

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  };

  return (
    <div
      className={`
        min-w-[300px] max-w-[400px] rounded-lg border shadow-lg backdrop-blur-sm
        ${styles.bg} ${styles.border}
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 ${styles.icon}`}>
          {TOAST_ICONS[toast.type]}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`font-semibold ${styles.text}`}>{toast.title}</div>
          {toast.message && (
            <div className={`mt-1 text-sm opacity-90 ${styles.text}`}>{toast.message}</div>
          )}
        </div>

        {toast.dismissible && (
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 ${styles.text} opacity-60 hover:opacity-100 transition-opacity`}
            aria-label="Fechar"
          >
            ✕
          </button>
        )}
      </div>

      {toast.action && (
        <div className="px-4 pb-3">
          <button
            onClick={() => {
              toast.action!.onClick();
              handleDismiss();
            }}
            className={`text-sm font-medium ${styles.icon} hover:underline`}
          >
            {toast.action.label}
          </button>
        </div>
      )}

      {toast.duration && toast.duration > 0 && (
        <div className="h-1 bg-white/10">
          <div
            className={`h-full ${styles.icon} opacity-50`}
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
  dismissible?: boolean;
}

export function useToastActions() {
  const { addToast } = useToast();

  const toast = useCallback(
    (options: ToastOptions) => addToast(options),
    [addToast]
  );

  const success = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'success', title, message, ...options }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'error', title, message, duration: 8000, ...options }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'warning', title, message, ...options }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'info', title, message, ...options }),
    [addToast]
  );

  return { toast, success, error, warning, info };
}
