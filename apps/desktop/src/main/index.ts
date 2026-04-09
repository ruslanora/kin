import path from 'node:path';

import { app, BrowserWindow, nativeImage } from 'electron';
import log from 'electron-log';
import started from 'electron-squirrel-startup';
import { updateElectronApp } from 'update-electron-app';

import { runMigrations, seedDefaults } from './database';
import { setupIpc } from './ipc';
import { startServer, stopServer } from './services/server';

log.errorHandler.startCatching();

if (started) {
  app.quit();
}

const createWindow = () => {
  const icon = nativeImage.createFromPath(
    path.join(app.getAppPath(), 'assets', 'icons', 'png', '512x512.png'),
  );

  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 640,
    minWidth: 1024,
    minHeight: 640,
    icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
};

app.on('ready', () => {
  runMigrations();
  seedDefaults();

  const window = createWindow();
  setupIpc(window);
  startServer(window);

  if (app.isPackaged) {
    try {
      updateElectronApp();
    } catch {
      // Skip
    }
  }
});

app.on('will-quit', () => {
  stopServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
