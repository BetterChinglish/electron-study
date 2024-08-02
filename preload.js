console.log('this is preload js')


const { contextBridge, ipcRenderer } = require('electron')



const handleSend = async () => {
  const execResult = await ipcRenderer.invoke('send-message', 'hello from preload');
  console.log(execResult);
  return execResult
}

contextBridge.exposeInMainWorld('myAPI',{
  halo: 'hello world',
  handleSend
})
