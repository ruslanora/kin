'use client';

import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const DrawerFooter: FunctionComponent<PropsType> = ({ children }) => (
  <div className="w-full flex flex-row items-center justify-end gap-4 p-4 border-t border-stone-200 dark:border-stone-800">
    {children}
  </div>
);

DrawerFooter.displayName = 'Drawer.Footer';
