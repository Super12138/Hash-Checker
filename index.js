const { app, BrowserWindow, Menu, shell } = require('electron');
const date = new Date();
const year = date.getFullYear();
const isPackaged = app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    center: true,
    // frame: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  if (isPackaged) {
    win.loadFile('index.html')
  } else {
    win.loadURL('http://localhost:8080/')
  }
  // win.webContents.openDevTools();
  // win.setWindowButtonVisibility(true)
}

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
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        role: 'undo'
      },
      {
        label: '恢复',
        role: 'redo'
      },
      {
        label: '剪切',
        role: 'cut'
      },
      {
        label: '复制',
        role: 'copy'
      },
      {
        label: '粘贴',
        role: 'paste'
      },
    ]
  },
  {
    label: '开发者选项',
    submenu: [
      {
        label: '打开开发者调试工具',
        role: 'toggleDevTools'
      },
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
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        role: 'undo'
      },
      {
        label: '恢复',
        role: 'redo'
      },
      {
        label: '剪切',
        role: 'cut'
      },
      {
        label: '复制',
        role: 'copy'
      },
      {
        label: '粘贴',
        role: 'paste'
      },
    ]
  },
  {
    label: '开发者选项',
    submenu: [
      {
        label: '打开开发者调试工具',
        role: 'toggleDevTools'
      },
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

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.setAboutPanelOptions({
  applicationName: 'Hash Checker',
  applicationVersion: '1.0.8',
  copyright: 'Copyright © 2019-' + year + ' Super12138',
  version: '1082'
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})