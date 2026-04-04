import type { BrowserWindow } from 'electron';

import { registerBoardHandlers } from './board';
import { registerCompanyHandlers } from './company';
import { registerContactHandlers } from './contact';
import { registerFileHandlers } from './file';
import { registerInterviewHandlers } from './interview';
import { registerJobHandlers } from './job';
import { registerThemeHandlers } from './theme';

export const setupIpc = (window: BrowserWindow): void => {
  registerThemeHandlers(window);
  registerBoardHandlers();
  registerCompanyHandlers();
  registerContactHandlers();
  registerFileHandlers();
  registerJobHandlers();
  registerInterviewHandlers();
};
