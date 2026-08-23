'use client';

import React, { useState, useEffect, ReactNode } from 'react';

export type LoadingType = 'spinner' | 'dots' | 'bar' | 'skeleton' | 'game' | 'bombs';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'border-cyan-500',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${color} border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Carregando..."
    />
  );
}

export interface LoadingDotsProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingDots({
  count = 3,
  size = 'md',
  color = 'bg-cyan-500',
  className = '',
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={`flex items-center gap-1 ${className}`} role="status" aria-label="Carregando...">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} ${color} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export interface LoadingBarProps {
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export function LoadingBar({
  progress,
  size = 'md',
  color = 'bg-cyan-500',
  showLabel = false,
  className = '',
}: LoadingBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const isIndeterminate = progress === undefined;

  return (
    <div className={`w-full ${className}`} role="status" aria-label="Carregando...">
      <div className={`w-full bg-slate-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        {isIndeterminate ? (
          <div className={`h-full ${color} rounded-full animate-indeterminate`} />
        ) : (
          <div
            className={`h-full ${color} rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        )}
      </div>
      {showLabel && progress !== undefined && (
        <div className="mt-1 text-xs text-slate-400 text-right">{Math.round(progress)}%</div>
      )}
    </div>
  );
}

export interface LoadingSkeletonProps {
  lines?: number;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function LoadingSkeleton({
  lines = 3,
  variant = 'text',
  width,
  height,
  className = '',
}: LoadingSkeletonProps) {
  if (variant === 'circular') {
    return (
      <div
        className={`bg-slate-700 rounded-full animate-pulse ${className}`}
        style={{ width: width || 40, height: height || 40 }}
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={`bg-slate-700 rounded-lg animate-pulse ${className}`}
        style={{ width: width || '100%', height: height || 200 }}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="bg-slate-700 rounded animate-pulse"
          style={{
            height: 16,
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

export interface LoadingGameProps {
  message?: string;
  showTips?: boolean;
  className?: string;
}

const GAME_TIPS = [
  'Use ventos a seu favor para tiros mais precisos',
  'Pressione F para usar habilidades especiais',
  'Cada personagem tem habilidades únicas',
  'Use o workshop para melhorar suas armas',
  'Astra Cores desbloqueiam novos personagens',
  'Treine no modo treino antes de batalhas importantes',
];

export function LoadingGame({
  message = 'Carregando...',
  showTips = true,
  className = '',
}: LoadingGameProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!showTips) return;

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GAME_TIPS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [showTips]);

  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-700 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-2 w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">{message}</h3>
        {showTips && (
          <p className="text-sm text-slate-400 max-w-xs">
            <span className="text-cyan-400 font-medium">Dica: </span>
            {GAME_TIPS[tipIndex]}
          </p>
        )}
      </div>

      <LoadingBar progress={undefined} size="sm" />
    </div>
  );
}

export interface LoadingBombsProps {
  count?: number;
  className?: string;
}

export function LoadingBombs({
  count = 5,
  className = '',
}: LoadingBombsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-label="Carregando...">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="relative"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="w-6 h-6 bg-slate-600 rounded-full animate-bounce" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export interface LoadingScreenProps {
  message?: string;
  progress?: number;
  showTips?: boolean;
  onCancel?: () => void;
  className?: string;
}

export function LoadingScreen({
  message = 'Carregando...',
  progress,
  showTips = true,
  onCancel,
  className = '',
}: LoadingScreenProps) {
  return (
    <div className={`fixed inset-0 bg-slate-900 flex flex-col items-center justify-center ${className}`}>
      <LoadingGame
        message={message}
        showTips={showTips}
      />

      {progress !== undefined && (
        <div className="w-64 mt-6">
          <LoadingBar progress={progress} showLabel />
        </div>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-8 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}

export interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  type?: LoadingType;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  type = 'spinner',
  message,
  className = '',
}: LoadingOverlayProps) {
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return <LoadingSpinner size="lg" />;
      case 'dots':
        return <LoadingDots size="lg" />;
      case 'bar':
        return <LoadingBar progress={undefined} size="md" />;
      case 'skeleton':
        return <LoadingSkeleton lines={3} />;
      case 'game':
        return <LoadingGame message={message} />;
      case 'bombs':
        return <LoadingBombs />;
      default:
        return <LoadingSpinner size="lg" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {children}

      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-50">
          {renderLoader()}
          {message && type !== 'game' && (
            <p className="mt-4 text-sm text-slate-300">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}

export interface LoadingButtonProps {
  isLoading: boolean;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function LoadingButton({
  isLoading,
  children,
  onClick,
  disabled,
  className = '',
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative ${className} ${isLoading ? 'cursor-wait' : ''}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
}
