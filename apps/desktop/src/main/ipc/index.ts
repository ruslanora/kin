import type { BrowserWindow } from 'electron';

import { registerBoardHandlers } from './board';
import { registerCompanyHandlers } from './company';
import { registerContactHandlers } from './contact';
import { registerDataHandlers } from './data';
import { registerFileHandlers } from './file';
import { registerInterviewHandlers } from './interview';
import { registerJobHandlers } from './job';
import { registerResumeHandlers } from './resume';
import { registerThemeHandlers } from './theme';

export const setupIpc = (window: BrowserWindow): void => {
  registerThemeHandlers(window);
  registerBoardHandlers();
  registerCompanyHandlers();
  registerContactHandlers();
  registerDataHandlers();
  registerFileHandlers();
  registerJobHandlers();
  registerInterviewHandlers();
  registerResumeHandlers();
};
