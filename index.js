const {
  app,
  BrowserWindow,
  Menu,
  shell
} = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    center: true,
    //webPreferences: {
    //nodeIntegration: true,
    //contextIsolation: false
    //},
  })
  win.loadFile('index.html')
  const wintemplate = [
    {
      label: '文件',
      submenu: [
        {
          label: '关于',
          role: 'about'
        },
        {
          label: '退出',
          role: 'quit'
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '使用说明',
          click: async () => {
            await shell.openExternal('https://github.com/Super12138/Hash-Checker')
          }
        }
      ]
    }
  ]
  const darwintemplate = [
    {
      label: app.name,
      submenu: [
        {
          label: '关于',
          role: 'about'
        },
        {
          label: '退出',
          role: 'quit'
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '使用说明',
          click: async () => {
            await shell.openExternal('https://github.com/Super12138/Hash-Checker')
          }
        }
      ]
    }
  ]
  if (process.platform == 'darwin') {
    const dmenu = Menu.buildFromTemplate(darwintemplate)
    Menu.setApplicationMenu(dmenu)
  }
  else {
    const wmenu = Menu.buildFromTemplate(wintemplate)
    Menu.setApplicationMenu(wmenu)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})