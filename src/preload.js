const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('settings', {
  saveKey: (address, mnemonic) => ipcRenderer.invoke('settings:saveKey', address, mnemonic),
  loadKeys: () => ipcRenderer.invoke('settings:loadKeys')
})

console.log('preloading!');