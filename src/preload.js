const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("settings", {
  getStoreValue: (key) => ipcRenderer.invoke("settings:getStoreValue", key),
  saveKey: (address, mnemonic) =>
    ipcRenderer.invoke("settings:saveKey", address, mnemonic),
  selectAddress: (address) =>
    ipcRenderer.invoke("settings:selectAddress", address),
  deleteAddress: (address) =>
    ipcRenderer.invoke("settings:deleteAddress", address),
});
