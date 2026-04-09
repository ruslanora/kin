import { handle } from './handle';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeMacPermissions = require('node-mac-permissions');

export const registerCalendarHandlers = (): void => {
  handle('calendar:get-permission-status', () => {
    return nodeMacPermissions.getAuthStatus('calendar') as string;
  });

  handle('calendar:request-permission', async () => {
    return (await nodeMacPermissions.askForCalendarAccess('full')) as string;
  });
};
