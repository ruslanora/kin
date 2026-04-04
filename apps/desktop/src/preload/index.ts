import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  interview: {
    getByMonth: (year: number, month: number) =>
      ipcRenderer.invoke('interview:getByMonth', year, month),
  },
});
