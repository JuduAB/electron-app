import {app,Tray,Menu } from 'electron'
import appIcon from '../../resources/icon.ico?asset'

const crerteTray = (tray,mainWindow) =>{
    tray = new Tray(appIcon);

    const contextMenu = Menu.buildFromTemplate([
        { label: '显示主窗口', click: () => { mainWindow.show(); },type:'normal' },
        { label: '退出', click: () => { mainWindow.destroy();app.quit(); },type:'normal' }
    ]);

    // 设置托盘菜单
    tray.setContextMenu(contextMenu);

    // 设置托盘提示
    tray.setToolTip('DCon测试工具');

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