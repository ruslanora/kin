'use client';

import { createContext, useContext } from 'react';

type ContextType = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export const ShellContext = createContext<ContextType | null>(null);

export const useShell = (): ContextType => {
  const context = useContext(ShellContext);

  if (!context) {
    throw new Error('useShell must be called within ShellContext provider!');
  }

  return context;
};
