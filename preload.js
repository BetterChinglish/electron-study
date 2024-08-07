console.log('this is preload js')


const {
  contextBridge,
  ipcRenderer,
  clipboard,
  desktopCapturer,
  nativeImage
} = require('electron')



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

const capture = async () => {
  const result = await ipcRenderer.invoke('capture-event');
  // console.log(result);
  return result.find((item, index) => index === 0);
};

const testNativeImg = () => {
  const img = nativeImage.createFromPath('test.png');
  console.log(img)
  return img;
}



contextBridge.exposeInMainWorld('myAPI',{
  halo: 'hello world',
  handleSend,
  showClipboardMsg,
  capture,
  testNativeImg
})