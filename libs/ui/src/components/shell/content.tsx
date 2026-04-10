'use client';

import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const ShellContent: FunctionComponent<PropsType> = ({ children }) => (
  <main role="main" className="flex-1 overflow-hidden">
    <div className="relative w-full h-full overflow-y-auto">{children}</div>
  </main>
);

ShellContent.displayName = 'Shell.Content';
