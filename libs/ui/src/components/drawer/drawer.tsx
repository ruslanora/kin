'use client';

import { classNames } from '@kin/ui';
import { AnimatePresence, motion } from 'framer-motion';
import type { FunctionComponent, ReactNode } from 'react';

import { DrawerContext } from './context';
import { DrawerBody } from './drawer-body';
import { DrawerFooter } from './drawer-footer';
import { DrawerHeader } from './drawer-header';

type PropsType = {
  state: boolean;
  open: () => void;
  close: () => void;
  children?: ReactNode;
};

const DrawerComponent: FunctionComponent<PropsType> = ({
  state,
  open,
  close,
  children,
}) => (
  <DrawerContext.Provider value={{ state, open, close }}>
    <AnimatePresence>
      {state && (
        <motion.div
          className={classNames(
            'fixed left-0 right-0 top-0 bottom-0 z-30',
            'flex flex-row items-stretch justify-end',
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
              'w-full max-w-md h-full',
              'flex flex-col',
              'bg-stone-50 dark:bg-stone-950',
              'border-l border-stone-200 dark:border-stone-800',
              'shadow-2xl',
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </DrawerContext.Provider>
);

DrawerComponent.displayName = 'Drawer';

export const Drawer = Object.assign(DrawerComponent, {
  Body: DrawerBody,
  Header: DrawerHeader,
  Footer: DrawerFooter,
});
