const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const { resolve } = require('path')
const WinState = require('electron-win-state').default;

const winState = new WinState({
  defaultWidth: 1500,
  defaultHeight: 1200
})


const createWindow = () => {
  const win = new BrowserWindow({
    // 每次重新打开都会使用默认配置的x、y位置信息，用户可能想要下次打开，使用上一次自己调的位置
    // 可以使用 electron-win-state 包实现该功能
    ...winState.winOptions,
    
    // 窗口大小
    // width: 1500,
    // height: 1200,
    
    // 窗口位置, 屏幕左上角为原点，向下是x轴正方向，向右是y轴正方向
    // x:300,
    // y:100,
    
    
    
    // 窗口背景颜色
    backgroundColor: '#115566',
    // 是否显示，false窗口将不会显示，可以使用win.show()重新显示，一般加载完成后，再重新调show()显示，避免短暂的空白
    // show: false,
    // 是否显示框架，即页面顶部默认的功能区域
    // frame: false,
    webPreferences: {
      // 预加载
      preload: resolve(__dirname, './preload.js'),
      // 取消沙盒模式
      sandbox: false,
    }
  })
  const wc = win.webContents;
  // 打开f12调试工具
  wc.openDevTools();
  
  // 完全加载完成的回调
  wc.on('did-finish-load', ()=>{
    console.log('did-finish-load');
  })
  
  // dom加载完成的回调
  wc.on('dom-ready', ()=>{
    console.log('dom-ready');
  })
  
  // 鼠标右键菜单的回调
  wc.on('context-menu', (event, params)=>{
    console.log('context-menu');
    // console.log(params);
    // selectionText：鼠标左键选中的文本
    // wc.executeJavaScript(`alert('${params.selectionText}')`)
    
    dialog.showOpenDialog({
      // 确认按钮的文字
      // buttonLabel: 'select',
      defaultPath: 'C:\\Users\\BetterChinglish\\OneDrive\\桌面\\拼多多入职信息',
      // title: '选个文档吧亲',
      // in windows or linux, filter是文件类型选择器，properties是文件选择器，二者不能同时使用
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
        { name: 'Custom File Type', extensions: ['as'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      // properties: ['multiSelections', 'createDirectory', 'openFile', 'openDirectory', 'showHiddenFiles'],
      // 打开路径
    }).then(result => {
      console.log(result)
    }).catch(err => {
      console.log(err)
    })
  })
  
  
  // 加载页面
  win.loadFile('index.html');
  
  winState.manage(win);
  
}

// 当app准备好后
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
  console.log(app.getPath('desktop'))
  console.log(app.getPath('music'))
  console.log(app.getPath('temp'))
  console.log(app.getPath('userData'))
})

ipcMain.handle('send-message', (event, message) => {
  console.log(message)
  return 'message received'
})

// 应用失焦与聚焦
app.on('browser-window-blur', () => {
    console.log('browser-window-blur')
})
app.on('browser-window-focus', () => {
  console.log('browser-window-focus')
})

// 应用窗口全部关闭时触发
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 应用关闭前触发
app.on('before-quit', () => {
  console.log('before-quit')
})

