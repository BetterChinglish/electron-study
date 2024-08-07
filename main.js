const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  globalShortcut,
  Menu,
  desktopCapturer,
  session
} = require('electron/main')
const { resolve } = require('path')
const createTray = require("./tray");
const WinState = require('electron-win-state').default;

const winState = new WinState({
  defaultWidth: 1500,
  defaultHeight: 1200
})

const mainMenuConfig = [
  {
    label: 'label1',
    submenu: [
      {
        label: 'submenu1',
        click: () => {
          console.log('submenu1')
        }
      },
      {
        label: 'submenu2',
        click: () => {
          console.log('submenu2')
        }
      }
    ]
  },
  {
    label: 'edit',
    submenu: [
      {
        role: 'copy'  // role的话是使用系统自带的功能
      }
    ]
  }
]

const mainMenu = Menu.buildFromTemplate(mainMenuConfig);

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
    
    
    // 弹出文件选择框
    // dialog.showOpenDialog({
    //   // 确认按钮的文字
    //   buttonLabel: 'select',
    //   defaultPath: app.getPath('desktop'),
    //   title: '选个文档吧亲',
    //   filters: [
    //     { name: 'pic', extensions: ['jpg', 'png'] }, 
    //   ],
    //   // properties: ['multiSelections', 'createDirectory', 'openFile', 'openDirectory', 'showHiddenFiles'],
    //   // 打开路径
    //   path: app.getPath('desktop'),
    // }).then(result => {
    //   console.log(result)
    // })
    
    // 弹出保存文件选择框
    // dialog.showSaveDialog({}).then(result => {
    //   console.log(result)
    // })
    
    // 弹出原生消息框
    // const answer = ["Yes", "No", "Maybe"];
    // dialog.showMessageBox({
    //   title: 'message box',
    //   message: 'hello world',
    //   detail: 'this is detail',
    //   buttons: answer,
    //  
    // }).then(result => {
    //   console.log(result);
    // })
    
    // 右键菜单
    mainMenu.popup();
    
  })
  
  // 窗口最上方的菜单区域设置
  Menu.setApplicationMenu(mainMenu);
  
  // 加载页面
  win.loadFile('index.html');
  
  createTray(app, win);
  
  winState.manage(win);
  
  // globalShortcut.register('a', () => {
  //   console.log('clicked a');
  //   globalShortcut.unregister('a');
  // })
  
  
}

// 当app准备好后
app.whenReady().then(() => {
  createWindow()
  
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      // Grant access to the first screen found.
      callback({ video: sources[0], audio: 'loopback' })
    })
  })
  
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

ipcMain.handle('capture-event', async (e, args) => {
  return desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: {
      width: 1920,
      height: 1080
    }
  })
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

