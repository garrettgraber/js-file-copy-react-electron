
// window.ipcRenderer = require('electron').ipcRenderer;

const {ipcRenderer, contextBridge} = require('electron');


contextBridge.exposeInMainWorld("ipcRenderer",ipcRenderer);

// console.log('ipcRenderer: ', ipcRenderer);


contextBridge.exposeInMainWorld("api",{
  send: (channel, data) => ipcRenderer.send(channel, data),
  recieve: (channel, func) => ipcRenderer.on(
    channel,
    (event, args) => func(event, args)
  ),
  removeAllListeners: () => ipcRenderer.removeAllListeners()
});
