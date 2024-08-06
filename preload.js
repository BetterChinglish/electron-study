console.log('this is preload js')


const { contextBridge, ipcRenderer, clipboard } = require('electron')



const handleSend = async () => {
  const execResult = await ipcRenderer.invoke('send-message', 'hello from preload');
  console.log(execResult);
  return execResult
}

const showClipboardMsg = () => {
  // 读第一条
  return clipboard.readText();
  
  // 往里面写：
  // clipboard.writeText('hello clipboard');
}


contextBridge.exposeInMainWorld('myAPI',{
  halo: 'hello world',
  handleSend,
  showClipboardMsg
})