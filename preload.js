console.log('this is preload js')


const { contextBridge, ipcRenderer, clipboard } = require('electron')



const handleSend = async () => {
  const execResult = await ipcRenderer.invoke('send-message', 'hello from preload');
  console.log(execResult);
  return execResult
}

const showClipboardMsg = () => {
  return clipboard.readText();
}


contextBridge.exposeInMainWorld('myAPI',{
  halo: 'hello world',
  handleSend,
  showClipboardMsg
})