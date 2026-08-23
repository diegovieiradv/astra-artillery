'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type LoadingPhase = 
  | 'idle' 
  | 'initial' 
  | 'home' 
  | 'region' 
  | 'battle' 
  | 'boss' 
  | 'worldmap' 
  | 'workshop' 
  | 'character' 
  | 'settings' 
  | 'about';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingContextValue {
  state: LoadingState;
  phase: LoadingPhase;
  progress: number;
  message: string;
  showPercent: boolean;
  startLoading: (phase: LoadingPhase, options?: LoadingOptions) => void;
  updateProgress: (progress: number, message?: string) => void;
  completeLoading: (success?: boolean) => void;
  showError: (message: string) => void;
  dismissError: () => void;
}

export interface LoadingOptions {
  message?: string;
  showPercent?: boolean;
  timeout?: number;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

interface LoadingStateInternal {
  state: LoadingState;
  phase: LoadingPhase;
  progress: number;
  message: string;
  showPercent: boolean;
  error: string | null;
  options: LoadingOptions | null;
}

type LoadingAction =
  | { type: 'START_LOADING'; payload: { phase: LoadingPhase; options?: LoadingOptions } }
  | { type: 'UPDATE_PROGRESS'; payload: { progress: number; message?: string } }
  | { type: 'COMPLETE_LOADING'; payload: { success: boolean } }
  | { type: 'SHOW_ERROR'; payload: { message: string } }
  | { type: 'DISMISS_ERROR' }
  | { type: 'RESET' };

const initialState: LoadingStateInternal = {
  state: 'idle',
  phase: 'idle',
  progress: 0,
  message: '',
  showPercent: true,
  error: null,
  options: null,
};

function loadingReducer(state: LoadingStateInternal, action: LoadingAction): LoadingStateInternal {
  switch (action.type) {
    case 'START_LOADING':
      return {
        ...state,
        state: 'loading',
        phase: action.payload.phase,
        progress: 0,
        message: action.payload.options?.message || '',
        showPercent: action.payload.options?.showPercent ?? true,
        error: null,
        options: action.payload.options || null,
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: Math.min(100, Math.max(0, action.payload.progress)),
        message: action.payload.message ?? state.message,
      };
    case 'COMPLETE_LOADING':
      return {
        ...state,
        state: action.payload.success ? 'success' : 'error',
        progress: action.payload.success ? 100 : state.progress,
        options: null,
      };
    case 'SHOW_ERROR':
      return {
        ...state,
        state: 'error',
        error: action.payload.message,
        options: null,
      };
    case 'DISMISS_ERROR':
      return {
        ...state,
        state: 'idle',
        error: null,
        phase: 'idle',
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(loadingReducer, initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback((phase: LoadingPhase, options?: LoadingOptions) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (options?.timeout) {
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: 'SHOW_ERROR', payload: { message: 'Tempo de carregamento excedido' } });
      }, options.timeout);
    }

    dispatch({ type: 'START_LOADING', payload: { phase, options } });
  }, []);

  const updateProgress = useCallback((progress: number, message?: string) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { progress, message } });
  }, []);

  const completeLoading = useCallback((success = true) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    dispatch({ type: 'COMPLETE_LOADING', payload: { success } });
  }, []);

  const showError = useCallback((message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    dispatch({ type: 'SHOW_ERROR', payload: { message } });
  }, []);

  const dismissError = useCallback(() => {
    dispatch({ type: 'DISMISS_ERROR' });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value: LoadingContextValue = {
    state: state.state,
    phase: state.phase,
    progress: state.progress,
    message: state.message,
    showPercent: state.showPercent,
    startLoading,
    updateProgress,
    completeLoading,
    showError,
    dismissError,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

const MESSAGES = {
  idle: [
    'Aguardando...',
    'Pronto para começar...',
  ],
  initial: [
    'Preparando a arena...',
    'Calculando o vento...',
    'Carregando aventureiros...',
    'Ajustando miras...',
    'Quase lá...',
  ],
  region: [
    'Explorando nova região...',
    'Carregando terreno...',
    'Preparando clima...',
    'Posicionando inimigos...',
  ],
  battle: [
    'Preparando arena...',
    'Carregando combatentes...',
    'Configurando física...',
    'Sincronizando vento...',
  ],
  boss: [
    'Boss se aproximando...',
    'Preparando batalha épica...',
    'Carregando ataques especiais...',
    'Quase pronto...',
  ],
  worldmap: [
    'Abrindo mapa-múndi...',
    'Carregando regiões...',
    'Sincronizando progresso...',
  ],
  workshop: [
    'Abrindo oficina...',
    'Carregando melhorias...',
    'Preparando cosméticos...',
  ],
  settings: [
    'Carregando configurações...',
    'Aplicando preferências...',
  ],
  home: [
    'Carregando menu principal...',
    'Preparando interface...',
    'Sincronizando configurações...',
  ],
  about: [
    'Carregando créditos...',
    'Preparando informações...',
  ],
  character: [
    'Carregando personagem...',
    'Preparando aventureiro...',
  ],
};

function getRandomMessage(phase: LoadingPhase): string {
  const messages = MESSAGES[phase] || MESSAGES.initial;
  return messages[Math.floor(Math.random() * messages.length)];
}

export { getRandomMessage, MESSAGES };