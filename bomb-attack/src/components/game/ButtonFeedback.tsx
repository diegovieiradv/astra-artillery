'use client';

import React, { useState, useRef, useCallback, ReactNode } from 'react';

export interface ButtonFeedbackProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  ripple?: boolean;
  pressScale?: number;
  hoverScale?: number;
  haptic?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function ButtonFeedback({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ripple = true,
  pressScale = 0.95,
  hoverScale = 1.02,
  haptic = true,
  type = 'button',
}: ButtonFeedbackProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(0);

  const createRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const newRipple: Ripple = {
        id: nextId.current++,
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    },
    [ripple]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      createRipple(e);

      if (haptic && navigator.vibrate) {
        navigator.vibrate(10);
      }

      onClick?.();
    },
    [disabled, createRipple, haptic, onClick]
  );

  const variantClasses = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/25',
    secondary: 'bg-slate-600 hover:bg-slate-500 text-white shadow-lg shadow-slate-500/25',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25',
    success: 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/25',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-lg font-bold
        transition-all duration-150 ease-out
        active:scale-[${pressScale}]
        hover:scale-[${hoverScale}]
        focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isPressed ? 'scale-[0.95]' : ''}
        ${className}
      `}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {ripple && (
        <span className="absolute inset-0 overflow-hidden rounded-lg">
          {ripples.map((r) => (
            <span
              key={r.id}
              className="absolute rounded-full bg-white/30 animate-ripple"
              style={{
                left: r.x - r.size / 2,
                top: r.y - r.size / 2,
                width: r.size,
                height: r.size,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}

export default ButtonFeedback;
