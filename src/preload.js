const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('settings', {
  getStoreValue: (key) => ipcRenderer.invoke('settings:getStoreValue', key),
  saveKey: (address, mnemonic) => ipcRenderer.invoke('settings:saveKey', address, mnemonic),
})

console.log('preloading!');