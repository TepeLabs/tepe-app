"use strict";

import { app, protocol, BrowserWindow, ipcMain, shell } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import settings from "@/utils/UtilSettings";
import fileIO from "@/utils/UtilFileIO";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 770,
    height: 750,
    title: "Tepe",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

function connectIPC() {
  ipcMain.handle("settings:saveChannel", settings.saveChannel);
  ipcMain.handle("settings:updateChannelInfo", settings.updateChannelInfo);
  ipcMain.handle("settings:deleteChannel", settings.deleteChannel);
  ipcMain.handle("settings:getChannels", settings.getChannels);
  ipcMain.handle("settings:saveAddressBook", settings.saveAddressBook);
  ipcMain.handle("settings:getAddressBook", settings.getAddressBook);
  ipcMain.handle("settings:getChannel", settings.getChannel);
  ipcMain.handle("settings:unlockWallet", settings.unlockWallet);
  ipcMain.handle("settings:walletUnlocked", settings.walletUnlocked);
  ipcMain.handle("settings:walletExists", settings.walletExists);
  ipcMain.handle("settings:setPassword", settings.setPassword);
  ipcMain.handle("settings:addKey", settings.addKey);
  ipcMain.handle("settings:saveWallet", settings.saveWallet);
  ipcMain.handle("settings:selectKey", settings.selectKey);
  ipcMain.handle("settings:deleteKey", settings.deleteKey);
  ipcMain.handle("settings:getCurrentKey", settings.getCurrentKey);
  ipcMain.handle("settings:getAllKeys", settings.getAllKeys);
  ipcMain.handle("fileio:selectFile", fileIO.selectFile);
  ipcMain.handle("fileio:selectPath", fileIO.selectPath);
  ipcMain.handle("fileio:basename", fileIO.basename);
  ipcMain.handle("fileio:join", fileIO.join);
  ipcMain.handle("fileio:openFile", fileIO.openFile);
  ipcMain.handle("fileio:saveFile", fileIO.saveFile);
  ipcMain.handle("fileio:saveIPFSFile", fileIO.saveIPFSFile);
  ipcMain.handle("fileio:openIPFSFile", fileIO.openIPFSFile);
  ipcMain.handle("externalaccess:openLink", (event, link) => shell.openExternal(link));
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  connectIPC();
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
