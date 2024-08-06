const { Tray, Menu } = require('electron');

function createTray(app, win) {

  // 创建托盘
  const tray = new Tray('test.png');
  // 设置托盘的标题
  tray.setToolTip('This is my application.');
  
  // 监听托盘的点击事件
  tray.on('click', (e) => {
    if (e.shiftKey) {
      app.quit();
    }
  })

  // 给托盘添加右键菜单
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'show',
      click: () => {
        win.show();
      }
    },
    {
      label: 'hide',
      click: ()=>{
        win.hide();
      }
    }
  ]))
}

module.exports = createTray;