'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

export type TooltipVariant = 'info' | 'warning' | 'error' | 'success' | 'help' | 'dark' | 'light';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  variant?: TooltipVariant;
  position?: TooltipPosition;
  delay?: number;
  arrow?: boolean;
  maxWidth?: string;
  className?: string;
  disabled?: boolean;
}

const VARIANT_STYLES: Record<TooltipVariant, { bg: string; text: string; border: string }> = {
  info: {
    bg: 'bg-cyan-900',
    text: 'text-cyan-100',
    border: 'border-cyan-700',
  },
  warning: {
    bg: 'bg-amber-900',
    text: 'text-amber-100',
    border: 'border-amber-700',
  },
  error: {
    bg: 'bg-red-900',
    text: 'text-red-100',
    border: 'border-red-700',
  },
  success: {
    bg: 'bg-green-900',
    text: 'text-green-100',
    border: 'border-green-700',
  },
  help: {
    bg: 'bg-purple-900',
    text: 'text-purple-100',
    border: 'border-purple-700',
  },
  dark: {
    bg: 'bg-slate-800',
    text: 'text-slate-100',
    border: 'border-slate-600',
  },
  light: {
    bg: 'bg-white',
    text: 'text-slate-900',
    border: 'border-slate-300',
  },
};

export function Tooltip({
  content,
  children,
  variant = 'dark',
  position = 'top',
  delay = 300,
  arrow = true,
  maxWidth = '250px',
  className = '',
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const styles = VARIANT_STYLES[variant];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let finalPosition = position;

    if (position === 'auto') {
      const spaceTop = triggerRect.top;
      const spaceBottom = viewport.height - triggerRect.bottom;
      const spaceLeft = triggerRect.left;
      const spaceRight = viewport.width - triggerRect.right;

      if (spaceTop >= tooltipRect.height + 8) {
        finalPosition = 'top';
      } else if (spaceBottom >= tooltipRect.height + 8) {
        finalPosition = 'bottom';
      } else if (spaceLeft >= tooltipRect.width + 8) {
        finalPosition = 'left';
      } else if (spaceRight >= tooltipRect.width + 8) {
        finalPosition = 'right';
      } else {
        finalPosition = 'bottom';
      }
    }

    setActualPosition(finalPosition);
  };

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getPositionClasses = (): string => {
    switch (actualPosition) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = (): string => {
    const base = 'absolute w-2 h-2 rotate-45';
    switch (actualPosition) {
      case 'top':
        return `${base} top-full left-1/2 -translate-x-1/2 -mt-1 ${styles.bg}`;
      case 'bottom':
        return `${base} bottom-full left-1/2 -translate-x-1/2 -mb-1 ${styles.bg}`;
      case 'left':
        return `${base} left-full top-1/2 -translate-y-1/2 -ml-1 ${styles.bg}`;
      case 'right':
        return `${base} right-full top-1/2 -translate-y-1/2 -mr-1 ${styles.bg}`;
      default:
        return `${base} top-full left-1/2 -translate-x-1/2 -mt-1 ${styles.bg}`;
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && content && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute z-50 px-3 py-2 text-sm font-medium
            rounded-lg border shadow-lg
            pointer-events-none
            animate-in fade-in zoom-in-95
            ${getPositionClasses()}
            ${styles.bg} ${styles.text} ${styles.border}
          `}
          style={{ maxWidth }}
        >
          {content}

          {arrow && <div className={getArrowClasses()} />}
        </div>
      )}
    </div>
  );
}

export interface TooltipGroupProps {
  children: ReactNode;
  variant?: TooltipVariant;
  position?: TooltipPosition;
  delay?: number;
}

export function TooltipGroup({
  children,
  variant = 'dark',
  position = 'top',
  delay = 300,
}: TooltipGroupProps) {
  return (
    <div className="space-y-2">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Tooltip) {
          return React.cloneElement(child as React.ReactElement<TooltipProps>, {
            variant,
            position,
            delay,
          });
        }
        return child;
      })}
    </div>
  );
}

export interface InfoTooltipProps {
  content: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function InfoTooltip({ content, children, className = '' }: InfoTooltipProps) {
  return (
    <Tooltip
      content={content}
      variant="help"
      position="auto"
      className={className}
    >
      {children || (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold cursor-help">
          ?
        </span>
      )}
    </Tooltip>
  );
}

export default Tooltip;
