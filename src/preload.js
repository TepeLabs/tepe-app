const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("settings", {
  getStoreValue: (key) => ipcRenderer.invoke("settings:getStoreValue", key),
  saveWallet: (address, mnemonic) =>
    ipcRenderer.invoke("settings:saveWallet", address, mnemonic),
  saveChannel: (channelAddress, nickname) =>
    ipcRenderer.invoke("settings:saveChannel", channelAddress, nickname),
  getChannel: (channelAddress) =>
    ipcRenderer.invoke("settings:getChannel", channelAddress),
  selectWallet: (wallet) =>
    ipcRenderer.invoke("settings:selectWallet", wallet),
  deleteWallet: (wallet) =>
    ipcRenderer.invoke("settings:deleteWallet", wallet),
  getCurrentWallet: () => ipcRenderer.invoke("settings:getCurrentWallet"),
  initializeWalletList: (walletListJSON) => ipcRenderer.invoke("settings:initializeWalletList", walletListJSON),
  initializeChannelList: (channelListJSON) => ipcRenderer.invoke("settings:initializeChannelList", channelListJSON),
});

contextBridge.exposeInMainWorld("fileio", {
  selectFile: () => ipcRenderer.invoke("fileio:selectFile"),
  openFile: (filePath) => ipcRenderer.invoke("fileio:openFile", filePath),
  saveFile: (contents, filePath) =>
    ipcRenderer.invoke("fileio:saveFile", contents, filePath),
  saveIPFSFile: (contents, cid) => ipcRenderer.invoke("fileio:saveIPFSFile", contents, cid),
  openIPFSFile: (cid) => ipcRenderer.invoke("fileio:openIPFSFile", cid),
});

contextBridge.exposeInMainWorld("env", {
  PROJECT_ID: process.env.PROJECT_ID,
  PROJECT_SECRET: process.env.PROJECT_SECRET,
});
