const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const Store = require('electron-store');

const date = new Date();
const store = new Store();
const year = date.getFullYear();
const isPackaged = app.isPackaged;
const isMac = process.platform === 'darwin';

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    center: true,
    title: 'Hash Checker',
    show: false,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (isPackaged) {
    win.loadFile('index.html');
  } else {
    win.loadURL('http://localhost:8080/');
    win.webContents.openDevTools();
  }

  win.once('ready-to-show', () => {
    win.show();
  });

  ipcMain.on('set-progress', (event, progress) => {
    win.setProgressBar(progress);
  });

  ipcMain.on('clear-progress', (event) => {
    win.setProgressBar(-1);
  });

  ipcMain.on('clear-cache', (event) => {
    win.webContents.session.clearStorageData({
      storages: [
        'appcache',
        'filesystem',
        'indexdb',
        'localstorage',
        'shadercache',
        'websql',
        'serviceworkers',
        'cachestorage'
      ],
      quotas: [
        'temporary',
        'persistent',
        'syncable'
      ]
    }).catch((error) => {
      dialog.showErrorBox('清除缓存出错', error);
    })
  })
  /*ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })*/
  // win.setWindowButtonVisibility(true)
}

const template = [
  {
    label: isMac ? app.name : '文件',
    submenu: [
      {
        label: '关于',
        role: 'about',
      },
      {
        label: '退出',
        role: 'quit',
      },
    ],
  },
  {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        role: 'undo',
      },
      {
        label: '恢复',
        role: 'redo',
      },
      {
        label: '剪切',
        role: 'cut',
      },
      {
        label: '复制',
        role: 'copy',
      },
      {
        label: '粘贴',
        role: 'paste',
      },
    ],
  },
  {
    label: '开发者选项',
    submenu: [
      {
        label: '打开开发者调试工具',
        role: 'toggleDevTools',
      },
    ],
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '使用说明',
        click: async () => {
          await shell.openExternal('https://super12138.github.io/hschecker/use.html');
        },
      },
      {
        label: '反馈 Bug',
        click: async () => {
          await shell.openExternal('https://github.com/Super12138/Hash-Checker/issues');
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.setAboutPanelOptions({
  applicationName: 'Hash Checker',
  applicationVersion: '1.0.9',
  copyright: 'Copyright © 2019-' + year + ' Super12138',
  version: '1083'
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

ipcMain.on('setValue', (event, name, value) => {
  store.set(name, value);
});

ipcMain.on('getValue', (event, name) => {
  const getValueResult = store.get(name);
  event.sender.send('getValueReply', getValueResult);
});

ipcMain.on('deleteAllValue', (event) => {
  store.clear();
});

ipcMain.on('restart-app', (event) => {
  app.relaunch();
  app.exit(0);
});

/*
ipcMain.on('choose-file', (event) => {
  const dialogConfig = {
    title: '选择文件',
    properties: ['openFile'],
    filters: [
      {
        name: '所有文件',
        extensions: ['*']
      }
    ]
  }
  const filePath = dialog.showOpenDialogSync(dialogConfig)
  event.sender.send('filePath', filePath)
})
*/