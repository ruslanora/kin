'use client';

import type { FunctionComponent, ReactNode } from 'react';

import { TabItem } from './item';

type PropsType = {
  children?: ReactNode;
};

const TabComponent: FunctionComponent<PropsType> = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto">
      <ul className="h-fit w-fit flex flex-nowrap flex-row items-center justify-start">
        {children}
      </ul>
    </div>
  );
};

TabComponent.displayName = 'Tab';

export const Tab = Object.assign(TabComponent, {
  Item: TabItem,
});
