import { ipcMain, type IpcMainInvokeEvent } from 'electron';

/**
 * Wraps ipcMain.handle with error logging. Errors are re-thrown so the
 * renderer receives a rejected promise — they are never silently swallowed.
 */
export function handle<TArgs extends unknown[] = unknown[]>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: TArgs) => unknown,
): void {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      return await handler(event, ...(args as TArgs));
    } catch (err) {
      console.error(`[IPC] ${channel} failed:`, err);
      throw err;
    }
  });
}
