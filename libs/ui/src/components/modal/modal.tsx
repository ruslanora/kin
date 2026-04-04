'use client';

import { classNames } from '@kin/ui/utils';
import { AnimatePresence, motion } from 'framer-motion';
import type { FunctionComponent, ReactNode } from 'react';

import { ModalContext } from './context';
import { ModalBody } from './modal-body';
import { ModalFooter } from './modal-footer';
import { ModalHeader } from './modal-header';

type PropsType = {
  state: boolean;
  open: () => void;
  close: () => void;
  children?: ReactNode;
};

const ModalComponent: FunctionComponent<PropsType> = ({
  state,
  open,
  close,
  children,
}) => (
  <ModalContext.Provider value={{ state, open, close }}>
    <AnimatePresence>
      {state && (
        <motion.div
          className={classNames(
            'fixed left-0 right-0 top-0 bottom-0 z-30 p-4',
            'flex flex-col items-center justify-center shrink-0',
            'backdrop-blur-md',
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          <motion.div
            className={classNames(
              'w-full max-w-lg h-fit max-h-125',
              'bg-stone-50 dark:bg-stone-900',
              'border border-stone-200 dark:border-stone-800',
              'rounded-2xl shadow-2xl',
            )}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </ModalContext.Provider>
);

ModalComponent.displayName = 'Modal';

export const Modal = Object.assign(ModalComponent, {
  Body: ModalBody,
  Header: ModalHeader,
  Footer: ModalFooter,
});
