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

contextBridge.exposeInMainWorld("fileio", {
  selectFile: () => ipcRenderer.invoke("fileio:selectFile"),
  openFile: (filePath) => ipcRenderer.invoke("fileio:openFile", filePath),
  saveFile: (contents, filePath) =>
    ipcRenderer.invoke("fileio:saveFile", contents, filePath),
  saveIPFSFile: (contents, cid) => ipcRenderer.invoke("fileio:saveIPFSFile", contents, cid),
});

contextBridge.exposeInMainWorld("env", {
  PROJECT_ID: process.env.PROJECT_ID,
  PROJECT_SECRET: process.env.PROJECT_SECRET,
});
