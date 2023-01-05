const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron')
const date = new Date()
const year = date.getFullYear()

// 设置深链接（应用协议）
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('hash-checker', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('hash-checker')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    createWindow()
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    center: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  win.loadFile('index.html')
  // win.webContents.openDevTools();
  // win.setWindowButtonVisibility(true)
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

app.setAboutPanelOptions({
  applicationName: 'Hash Checker',
  applicationVersion: '1.0.5',
  copyright: 'Copyright © 2019-' + year + ' Super12138',
  version: '1050'
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 生成成功
ipcMain.on('gen-ok', (event) => {
  const options = {
    type: 'info',
    buttons: ['确定'],
    message: '计算完成，校验值已写入您的剪贴板'
  }
  dialog.showMessageBox(options)
})

// 校验成功
ipcMain.on('check-ok', (event) => {
  const options = {
    type: 'info',
    buttons: ['确定'],
    message: '🎉 校验成功！请放心使用您的文件'
  }
  dialog.showMessageBox(options)
})

// 校验失败
ipcMain.on('check-fail', (event) => {
  const options = {
    type: 'error',
    buttons: ['确定'],
    message: '校验失败，详情请在“状态”面板查看'
  }
  dialog.showMessageBox(options)
})

// 什么也没选
ipcMain.on('no-modmeth', (event) => {
  const options = {
    type: 'error',
    buttons: ['确定'],
    message: '请选择方法和模式后再进行校验'
  }
  dialog.showMessageBox(options)
})

// 未选文件
ipcMain.on('no-file', (event) => {
  const options = {
    type: 'error',
    buttons: ['确定'],
    message: '请选择文件后再进行校验'
  }
  dialog.showMessageBox(options)
})

// 未选方法
ipcMain.on('no-method', (event) => {
  const options = {
    type: 'error',
    buttons: ['确定'],
    message: '请选择校验方法后再进行校验'
  }
  dialog.showMessageBox(options)
})

// 未选模式
ipcMain.on('no-model', (event) => {
  const options = {
    type: 'error',
    buttons: ['确定'],
    message: '请选择校验模式后再进行校验'
  }
  dialog.showMessageBox(options)
})

// 没有校验值
ipcMain.on('no-checksum', (event) => {
  const options = {
    type: 'error',
    buttons: ['确定'],
    message: '请输入校验值后再进行校验'
  }
  dialog.showMessageBox(options)
})