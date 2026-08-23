'use client';

import React, { useEffect, useState, ReactNode } from 'react';

export type TransitionType = 
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip'
  | 'blur';

export interface TransitionConfig {
  type: TransitionType;
  duration: number;
  easing: string;
}

export interface MenuTransitionsProps {
  children: ReactNode;
  type?: TransitionType;
  duration?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

const TRANSITION_STYLES: Record<TransitionType, { initial: React.CSSProperties; animate: React.CSSProperties }> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  'slide-up': {
    initial: { opacity: 0, transform: 'translateY(30px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
  },
  'slide-down': {
    initial: { opacity: 0, transform: 'translateY(-30px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
  },
  'slide-left': {
    initial: { opacity: 0, transform: 'translateX(30px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
  },
  'slide-right': {
    initial: { opacity: 0, transform: 'translateX(-30px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    initial: { opacity: 0, transform: 'scale(0.9)' },
    animate: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    initial: { opacity: 0, transform: 'scale(1.1)' },
    animate: { opacity: 1, transform: 'scale(1)' },
  },
  flip: {
    initial: { opacity: 0, transform: 'perspective(1000px) rotateY(-10deg)' },
    animate: { opacity: 1, transform: 'perspective(1000px) rotateY(0)' },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0)' },
  },
};

export function MenuTransitions({
  children,
  type = 'fade',
  duration = 300,
  delay = 0,
  onComplete,
  className = '',
}: MenuTransitionsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, onComplete]);

  const config = TRANSITION_STYLES[type];
  const currentStyle = isVisible ? config.animate : config.initial;

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        ...currentStyle,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

export interface StaggeredMenuProps {
  children: ReactNode[];
  type?: TransitionType;
  staggerDelay?: number;
  duration?: number;
  className?: string;
}

export function StaggeredMenu({
  children,
  type = 'slide-up',
  staggerDelay = 50,
  duration = 300,
  className = '',
}: StaggeredMenuProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <MenuTransitions
          key={index}
          type={type}
          duration={duration}
          delay={index * staggerDelay}
        >
          {child}
        </MenuTransitions>
      ))}
    </div>
  );
}

export interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  duration?: number;
  className?: string;
}

export function PageTransition({
  children,
  type = 'fade',
  duration = 300,
  className = '',
}: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <MenuTransitions type={type} duration={duration} className={className}>
      {children}
    </MenuTransitions>
  );
}

export interface TransitionGroupProps {
  children: ReactNode;
  show: boolean;
  type?: TransitionType;
  duration?: number;
  unmountOnExit?: boolean;
  className?: string;
}

export function TransitionGroup({
  children,
  show,
  type = 'fade',
  duration = 300,
  unmountOnExit = true,
  className = '',
}: TransitionGroupProps) {
  const [shouldRender, setShouldRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      if (unmountOnExit) {
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration, unmountOnExit]);

  if (!shouldRender) {
    return null;
  }

  const config = TRANSITION_STYLES[type];
  const currentStyle = show ? config.animate : config.initial;

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        ...currentStyle,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

export default MenuTransitions;
