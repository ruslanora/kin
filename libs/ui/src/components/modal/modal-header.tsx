'use client';

import { classNames } from '@kin/ui';
import type { FunctionComponent, ReactNode } from 'react';

import { IconButton } from '../icon-button';
import { useModal } from './context';

type PropsType = {
  children?: ReactNode;
};

export const ModalHeader: FunctionComponent<PropsType> = ({ children }) => {
  const { close } = useModal();

  return (
    <div
      className={classNames(
        'w-full flex flex-row items-center justify-between',
        'pl-6 py-4 pr-2',
      )}
    >
      <span className="text-sm font-medium truncate">{children}</span>
      <IconButton icon="x" onClick={close} />
    </div>
  );
};
