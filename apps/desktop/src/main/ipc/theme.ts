import { type BrowserWindow, nativeTheme } from 'electron';

import { handle } from './handle';

export const registerThemeHandlers = (mainWindow: BrowserWindow): void => {
  handle('theme:set', (_, theme: 'light' | 'dark' | 'system') => {
    nativeTheme.themeSource = theme;
  });

  nativeTheme.on('updated', () => {
    mainWindow.webContents.send(
      'theme:changed',
      nativeTheme.shouldUseDarkColors,
    );
  });
};
