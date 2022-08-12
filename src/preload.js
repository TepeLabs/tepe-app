const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("settings", {
  getStoreValue: (key) => ipcRenderer.invoke("settings:getStoreValue", key),
  saveKey: (address, mnemonic) =>
    ipcRenderer.invoke("settings:saveKey", address, mnemonic),
  selectAddress: (address) =>
    ipcRenderer.invoke("settings:selectAddress", address),
  deleteAddress: (address) =>
    ipcRenderer.invoke("settings:deleteAddress", address),
  getCurrentWallet: () => ipcRenderer.invoke("settings:getCurrentWallet"),
});

contextBridge.exposeInMainWorld("file", {
  selectFile: () => ipcRenderer.invoke("file:selectFile"),
  openFile: (filePath) => ipcRenderer.invoke("file:openFile", filePath),
  saveFile: (contents, filePath) =>
    ipcRenderer.invoke("file:saveFile", contents, filePath),
});

contextBridge.exposeInMainWorld("env", {
  PROJECT_ID: process.env.PROJECT_ID,
  PROJECT_SECRET: process.env.PROJECT_SECRET,
});
