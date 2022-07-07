const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  doSomething: () => ipcRenderer.invoke('settings:doSomething')
})

console.log('preloading!');