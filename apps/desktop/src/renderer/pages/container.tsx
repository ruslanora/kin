import { classNames, IconButton } from '@kin/ui';
import type { FunctionComponent, ReactNode } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import { useFocusRing, useTheme } from '../hooks';

type PropsType = {
  canGoBack?: boolean;
  panel?: ReactNode;
  children?: ReactNode;
};

export const PageContainer: FunctionComponent<PropsType> = ({
  panel,
  canGoBack,
  children,
}) => {
  const navigate = useNavigate();
  const isSettings = useMatch('/settings');
  const { theme, setTheme } = useTheme();

  useFocusRing();

  return (
    <div
      className={classNames(
        'relative',
        'w-full h-full',
        'flex flex-col items-stretch justify-start',
        'overflow-hidden',
      )}
    >
      <div
        className={classNames(
          'h-14 w-full',
          'flex flex-row items-center justify-between',
          'px-4 py-2',
        )}
      >
        <div className="flex flex-row items-center justify-start">
          {canGoBack && (
            <IconButton icon="arrow-left" onClick={() => navigate(-1)} />
          )}
        </div>
        <div className="flex-1 shrink-0 px-4">{panel}</div>
        <ul className="flex flex-row items-center justify-end gap-4">
          <li>
            <ul className="flex flex-row items-center justify-center p-1 rounded-xl gap-1 bg-stone-100 dark:bg-stone-900">
              <li>
                <IconButton
                  size="sm"
                  icon="sun"
                  active={theme === 'light'}
                  onClick={() => setTheme('light')}
                />
              </li>
              <li>
                <IconButton
                  size="sm"
                  icon="moon"
                  active={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                />
              </li>
              <li>
                <IconButton
                  size="sm"
                  icon="monitor"
                  active={theme === 'system'}
                  onClick={() => setTheme('system')}
                />
              </li>
            </ul>
          </li>
          <li>
            <IconButton
              icon="settings"
              active={!!isSettings}
              onClick={() => navigate('/settings')}
            />
          </li>
        </ul>
      </div>
      <div
        className={classNames(
          'flex flex-1 flex-col items-stretch justify-start',
          'min-h-0 overflow-hidden',
        )}
      >
        {children}
      </div>
    </div>
  );
};
