'use client';

import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const ModalBody: FunctionComponent<PropsType> = ({ children }) => {
  return (
    <div className="px-6 py-4 flex-1 min-h-0 overflow-y-auto">{children}</div>
  );
};

ModalBody.displayName = 'Modal.Body';
