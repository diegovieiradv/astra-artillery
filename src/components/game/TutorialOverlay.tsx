'use client';

import React, { useState, useEffect, useCallback, ReactNode } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
  action?: 'click' | 'swipe' | 'wait';
  duration?: number;
}

export interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip?: () => void;
  currentStep?: number;
  showProgress?: boolean;
  allowSkip?: boolean;
  overlayColor?: string;
  highlightColor?: string;
  className?: string;
}

export function TutorialOverlay({
  steps,
  onComplete,
  onSkip,
  currentStep: externalStep,
  showProgress = true,
  allowSkip = true,
  overlayColor = 'rgba(0, 0, 0, 0.8)',
  highlightColor = 'rgba(74, 222, 128, 0.3)',
  className = '',
}: TutorialOverlayProps) {
  const [internalStep, setInternalStep] = useState(0);
  const currentStep = externalStep ?? internalStep;
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const step = steps[currentStep];

  useEffect(() => {
    if (step?.target) {
      const updateRect = () => {
        const element = document.querySelector(step.target!);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
        }
      };

      updateRect();
      window.addEventListener('resize', updateRect);
      window.addEventListener('scroll', updateRect);

      return () => {
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect);
      };
    }
  }, [step?.target]);

  useEffect(() => {
    if (step?.action === 'wait' && step.duration) {
      const timer = setTimeout(() => {
        handleNext();
      }, step.duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep, step?.action, step?.duration]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setInternalStep(currentStep + 1);
    } else {
      setIsVisible(false);
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setInternalStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    setIsVisible(false);
    onSkip?.();
    onComplete();
  }, [onSkip, onComplete]);

  const handleBackdropClick = useCallback(() => {
    if (step?.action === 'click') {
      handleNext();
    }
  }, [step?.action, handleNext]);

  if (!isVisible || !step) {
    return null;
  }

  const getPositionClasses = (): string => {
    if (!targetRect) {
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }

    switch (step.position || 'bottom') {
      case 'top':
        return `bottom-[${window.innerHeight - targetRect.top + 16}px] left-[${targetRect.left + targetRect.width / 2}px] -translate-x-1/2`;
      case 'bottom':
        return `top-[${targetRect.bottom + 16}px] left-[${targetRect.left + targetRect.width / 2}px] -translate-x-1/2`;
      case 'left':
        return `top-[${targetRect.top + targetRect.height / 2}px] right-[${window.innerWidth - targetRect.left + 16}px] -translate-y-1/2`;
      case 'right':
        return `top-[${targetRect.top + targetRect.height / 2}px] left-[${targetRect.right + 16}px] -translate-y-1/2`;
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] ${className}`}>
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: overlayColor }}
        onClick={handleBackdropClick}
      />

      {targetRect && step.highlight && (
        <div
          className="absolute rounded-lg transition-all duration-300"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: `0 0 0 9999px ${overlayColor}`,
            border: `2px solid ${highlightColor}`,
            backgroundColor: highlightColor,
          }}
        />
      )}

      <div
        className={`absolute ${getPositionClasses()} max-w-sm w-full`}
      >
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-600 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <span className="text-xs text-slate-400">
                {currentStep + 1} / {steps.length}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
          </div>

          {showProgress && (
            <div className="px-4 pb-2">
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-slate-900/50">
            <div className="flex gap-2">
              {allowSkip && (
                <button
                  onClick={handleSkip}
                  className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Pular Tutorial
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Anterior
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
              </button>
            </div>
          </div>
        </div>

        {targetRect && step.highlight && (
          <div className="absolute left-1/2 -translate-x-1/2 -mt-2">
            <div className="w-4 h-4 bg-slate-800 border-b border-r border-slate-600 transform rotate-45 -translate-y-2" />
          </div>
        )}
      </div>
    </div>
  );
}

export interface TutorialProgressProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function TutorialProgress({
  totalSteps,
  currentStep,
  className = '',
}: TutorialProgressProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            i === currentStep
              ? 'bg-cyan-500 w-4'
              : i < currentStep
              ? 'bg-cyan-700'
              : 'bg-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

export interface TutorialTriggerProps {
  children: ReactNode;
  steps: TutorialStep[];
  onComplete: () => void;
  trigger?: 'auto' | 'manual';
  delay?: number;
}

export function TutorialTrigger({
  children,
  steps,
  onComplete,
  trigger = 'auto',
  delay = 1000,
}: TutorialTriggerProps) {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (trigger === 'auto') {
      const hasSeenTutorial = localStorage.getItem('tutorial_completed');
      if (!hasSeenTutorial) {
        const timer = setTimeout(() => {
          setShowTutorial(true);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [trigger, delay]);

  const handleComplete = () => {
    localStorage.setItem('tutorial_completed', 'true');
    setShowTutorial(false);
    onComplete();
  };

  return (
    <>
      {children}

      {showTutorial && (
        <TutorialOverlay
          steps={steps}
          onComplete={handleComplete}
          onSkip={handleComplete}
        />
      )}
    </>
  );
}

export default TutorialOverlay;
