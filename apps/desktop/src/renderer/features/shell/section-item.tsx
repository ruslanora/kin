import { classNames, Icon, useShell } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';

import type { LinkType } from './types';

export const SectionItem: FunctionComponent<LinkType> = ({
  icon,
  name,
  href,
}) => {
  const { collapsed } = useShell();

  return (
    <li className="w-full">
      <NavLink
        to={href}
        onClick={(event) => event.stopPropagation()}
        className={({ isActive }) =>
          classNames(
            'w-full flex flex-row flex-nowrap items-center justify-start shrink-0',
            'rounded-md overflow-hidden',
            'transition-all duration-300 ease-in-out',
            'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
            isActive
              ? 'text-stone-500 bg-stone-200 dark:text-stone-400 dark:bg-stone-800'
              : 'text-stone-400 bg-transparent hover:text-stone-500 hover:bg-stone-200 dark:text-stone-500 dark:hover:text-stone-400 dark:hover:bg-stone-800',
          )
        }
      >
        <span
          className={classNames(
            'h-10 w-10',
            'flex items-center justify-center shrink-0',
          )}
        >
          <Icon name={icon} size={18} />
        </span>
        <span
          className={classNames(
            'text-sm font-normal',
            'whitespace-nowrap flex-nowrap text-stone-950! dark:text-stone-50!',
            collapsed && 'w-0 overflow-hidden opacity-0',
          )}
        >
          {name}
        </span>
      </NavLink>
    </li>
  );
};
