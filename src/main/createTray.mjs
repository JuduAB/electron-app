import {app,Tray,Menu,nativeImage } from 'electron'
import path from 'path'
import appIcon from '../../resources/icon.ico?asset'

const crerteTray = (tray,mainWindow) =>{
    tray = new Tray(appIcon);

    const contextMenu = Menu.buildFromTemplate([
        { label: '显示主窗口', click: () => { mainWindow.show(); } },
        { label: '退出', click: () => { app.quit(); } }
    ]);

    // 设置托盘菜单
    tray.setContextMenu(contextMenu);

    // 设置托盘提示
    tray.setToolTip('这是我的 Electron 应用');

    // 单击托盘图标事件
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });
}

export {crerteTray}