'use client';

import { classNames } from '@kin/ui/utils';
import type { FunctionComponent, ReactNode } from 'react';

import { IconButton } from '../icon-button';
import { useDrawer } from './context';

type PropsType = {
  children?: ReactNode;
};

export const DrawerHeader: FunctionComponent<PropsType> = ({ children }) => {
  const { close } = useDrawer();

  return (
    <div
      className={classNames(
        'w-full flex flex-row items-center justify-between',
        'pl-4 py-2 pr-2',
      )}
    >
      <span className="text-sm font-medium truncate">{children}</span>
      <IconButton icon="x" onClick={close} />
    </div>
  );
};

DrawerHeader.displayName = 'Drawer.Header';
