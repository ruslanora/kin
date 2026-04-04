'use client';

import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const ModalFooter: FunctionComponent<PropsType> = ({ children }) => (
  <div className="w-full flex flex-row items-center justify-end gap-4 p-4">
    {children}
  </div>
);

ModalFooter.displayName = 'Modal.Footer';
