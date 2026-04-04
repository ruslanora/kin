'use client';

import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const DrawerBody: FunctionComponent<PropsType> = ({ children }) => {
  return <div className="flex-1 px-6 py-4 overflow-y-auto">{children}</div>;
};

DrawerBody.displayName = 'Drawer.Body';
