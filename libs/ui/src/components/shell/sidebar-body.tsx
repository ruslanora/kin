'use client';

import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const ShellSidebarBody: FunctionComponent<PropsType> = ({
  children,
}) => <div className="flex-1 overflow-y-auto p-2">{children}</div>;

ShellSidebarBody.displayName = 'Shell.Sidebar.Body';
