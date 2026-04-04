'use client';

import { createContext, useContext } from 'react';

type ContextType = {
  state: boolean;
  open: () => void;
  close: () => void;
};

export const ModalContext = createContext<ContextType | null>(null);

export const useModal = (): ContextType => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within ModalContext provider!');
  }

  return context;
};
