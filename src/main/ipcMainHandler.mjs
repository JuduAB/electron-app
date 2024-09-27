import { ipcMain } from 'electron';
import dgram from 'dgram'
import { Buffer } from 'node:buffer';
import { findDevice } from './findDevice.mjs'
import { polling } from './polling.mjs'

class IPCMainHandler {
    constructor(win) {
        this.registerHandlers(win);
    }

    registerHandlers(win) {
        const client = dgram.createSocket("udp4");

        ipcMain.on('ping',async(event, message) => {
            client.send(message.content, 1119,message.targetIP)
        })

        ipcMain.on('find',async(event, message) => {
            findDevice(win)
        })
        
        ipcMain.on('reset',async (event,message) =>{
            const temp = Buffer.from(message.content,'hex');
            client.send(temp, 1119,message.targetIP)
        })

        ipcMain.on('polling',(event, message) => {
            if(message.status){
                polling.start(win,message.targetIP)
            }else {
                polling.stop()
            }
        })

        client.on("message", (msg, rinfo) => {
            win.webContents.send('message',msg.toString())
            console.log(msg.toString())
        })
    }

    sendToRenderer(webContents, channel, message) {
        webContents.send(channel, message);
    }
}

export default IPCMainHandler;