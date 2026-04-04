'use client';

import { createContext, useContext } from 'react';

type ContextType = {
  state: boolean;
  open: () => void;
  close: () => void;
};

export const DrawerContext = createContext<ContextType | null>(null);

export const useDrawer = (): ContextType => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawer must be used within DrawerContext provider!');
  }

  return context;
};
