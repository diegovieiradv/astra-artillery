'use client';

import { useEffect, useRef } from 'react';
import { useGameControls } from '@/hooks/usePhaserGame';

interface MobileControlsProps {
  onFire?: () => void;
  onAbility?: () => void;
  disabled?: boolean;
  setMobileInput?: (input: Partial<{ left: boolean; right: boolean; angleUp: boolean; angleDown: boolean; fire: boolean; ability: boolean }>) => void;
}

export function MobileControls({ 
  onFire, 
  onAbility, 
  disabled = false, 
  setMobileInput 
}: MobileControlsProps) {
  const { controls, handleTouchStart, handleTouchEnd } = useGameControls();
  const fireTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const angleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (setMobileInput) {
      setMobileInput(controls);
    }
  }, [controls, setMobileInput]);

  useEffect(() => {
    if (controls.fire && !disabled) {
      if (onFire) onFire();
    }
  }, [controls.fire, disabled, onFire]);

  useEffect(() => {
    if (controls.ability && !disabled) {
      if (onAbility) onAbility();
    }
  }, [controls.ability, disabled, onAbility]);

  const handleFireStart = () => {
    if (disabled) return;
    fireTimeoutRef.current = setTimeout(() => {
      if (onFire) onFire();
    }, 100);
  };

  const handleFireEnd = () => {
    if (fireTimeoutRef.current) {
      clearTimeout(fireTimeoutRef.current);
      fireTimeoutRef.current = null;
    }
  };

  const handleMoveStart = (action: 'left' | 'right' | 'angleUp' | 'angleDown') => {
    if (disabled) return;
    handleTouchStart(action);
    if (action === 'left' || action === 'right') {
      moveIntervalRef.current = setInterval(() => handleTouchStart(action), 50);
    } else {
      angleIntervalRef.current = setInterval(() => handleTouchStart(action), 50);
    }
  };

  const handleMoveEnd = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    if (angleIntervalRef.current) {
      clearInterval(angleIntervalRef.current);
      angleIntervalRef.current = null;
    }
    handleTouchEnd('left');
    handleTouchEnd('right');
    handleTouchEnd('angleUp');
    handleTouchEnd('angleDown');
  };

  if (typeof window === 'undefined' || window.innerWidth >= 768) {
    return null;
  }

  return (
    <div className="mobile-controls" role="group" aria-label="Controles do jogo">
      <div className="move-controls">
        <button
          className="control-btn move-btn"
          onTouchStart={() => handleMoveStart('left')}
          onTouchEnd={handleMoveEnd}
          onMouseDown={() => handleMoveStart('left')}
          onMouseUp={handleMoveEnd}
          onMouseLeave={handleMoveEnd}
          aria-label="Mover para esquerda"
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className="control-btn move-btn"
          onTouchStart={() => handleMoveStart('right')}
          onTouchEnd={handleMoveEnd}
          onMouseDown={() => handleMoveStart('right')}
          onMouseUp={handleMoveEnd}
          onMouseLeave={handleMoveEnd}
          aria-label="Mover para direita"
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="action-controls">
        <div className="angle-controls">
          <button
            className="control-btn angle-btn"
            onTouchStart={() => handleMoveStart('angleUp')}
            onTouchEnd={handleMoveEnd}
            onMouseDown={() => handleMoveStart('angleUp')}
            onMouseUp={handleMoveEnd}
            onMouseLeave={handleMoveEnd}
            aria-label="Aumentar ângulo"
            disabled={disabled}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="control-btn angle-btn"
            onTouchStart={() => handleMoveStart('angleDown')}
            onTouchEnd={handleMoveEnd}
            onMouseDown={() => handleMoveStart('angleDown')}
            onMouseUp={handleMoveEnd}
            onMouseLeave={handleMoveEnd}
            aria-label="Diminuir ângulo"
            disabled={disabled}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <button
          className="control-btn fire-btn"
          onTouchStart={handleFireStart}
          onTouchEnd={handleFireEnd}
          onMouseDown={handleFireStart}
          onMouseUp={handleFireEnd}
          onMouseLeave={handleFireEnd}
          aria-label="Carregar e disparar"
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M2.25 2.25l19.5 19.5M21.75 2.25L2.25 21.75" strokeLinecap="round"/>
          </svg>
        </button>

        <button
          className="control-btn ability-btn"
          onClick={onAbility}
          aria-label="Habilidade especial"
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M12 2v20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}