import type { BrowserWindow } from 'electron';

import { registerBoardHandlers } from './board';
import { registerCalendarHandlers } from './calendar';
import { registerCompanyHandlers } from './company';
import { registerContactHandlers } from './contact';
import { registerCoverLetterHandlers } from './cover-letter';
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
  registerCoverLetterHandlers();
  registerDataHandlers();
  registerFileHandlers();
  registerJobHandlers();
  registerInterviewHandlers();
  registerResumeHandlers();
  registerCalendarHandlers();
};
