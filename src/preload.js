const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("settings", {
  saveWallet: (address, mnemonic) =>
    ipcRenderer.invoke("settings:saveWallet", address, mnemonic),
  saveChannel: (walletAddress, channelAddress, nickname) =>
    ipcRenderer.invoke("settings:saveChannel", walletAddress, channelAddress, nickname),
  getChannel: (walletAddress, channelAddress) => ipcRenderer.invoke("settings:getChannel", walletAddress, channelAddress),
  getChannels: (walletAddress) => ipcRenderer.invoke("settings:getChannels", walletAddress),
  selectWallet: (wallet) =>
    ipcRenderer.invoke("settings:selectWallet", wallet),
  deleteWallet: (wallet) =>
    ipcRenderer.invoke("settings:deleteWallet", wallet),
  getCurrentWallet: () => ipcRenderer.invoke("settings:getCurrentWallet"),
  getAllWallets: () => ipcRenderer.invoke("settings:getAllWallets"),
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
