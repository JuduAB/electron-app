import { app, shell, BrowserWindow, ipcMain,Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {crerteTray} from './createTray.mjs'
import IPCMainHandler from './ipcMainHandler.mjs'

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.exit()
}else{
    app.on('second-instance',(event,argv,workerDirector) => {
        if(mainWindow) {
            if(mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    })
}

let mainWindow
let tray
let ipcMainHandlerInstance

function createWindow() {
    // 创建窗口.
        Menu.setApplicationMenu(null)
        mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        // autoHideMenuBar: true,  //决定窗口菜单栏是否自动隐藏。 一旦设置，菜单栏将只在用户单击 Alt 键时显示。
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.setTitle("DConTestTool")

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createWindow()
    crerteTray(tray,mainWindow)
    ipcMainHandlerInstance = new IPCMainHandler(mainWindow)

    mainWindow.on('close',event => {
        event.preventDefault()
        mainWindow.hide()
    })
    
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
