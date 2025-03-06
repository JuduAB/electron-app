import { ipcMain,clipboard  } from 'electron';
import dgram from 'dgram'
import { Buffer } from 'node:buffer';
import { findDevice } from './findDevice.mjs'
import Polling from './polling.mjs'
import os from 'os'
import arp from 'node-arp';

class IPCMainHandler {

    constructor(win) {
        this.registerHandlers(win, this.#client, this.#polling);
    }

    #client = dgram.createSocket("udp4");
    #polling = new Polling(dgram.createSocket("udp4"))

    registerHandlers(win, client, polling) {
        let networkInterface;

        ipcMain.on('ping', async (event, message) => {
            if (typeof message === 'object') {
                client.send(message.content, 1119, message.targetIP)
            }
        })

        ipcMain.handle('dialog:getMAC', async (event, message) => {
            try {
                const mac = await new Promise((resolve, reject) => {
                    arp.getMAC(message.targetIP, (err, mac) => {
                        if (err) {
                            reject(err.message); 
                        } else {
                            resolve(mac.toUpperCase());
                        }
                    });
                });
                
                clipboard.writeText(mac);
                win.webContents.send('message', mac);
                return mac;
            } catch (error) {
                console.error('Error retrieving MAC address:', error);
                return { error };
            }
        });

        ipcMain.on('find', async (event, message) => {
            findDevice(win, networkInterface);
        })

        ipcMain.on('reset', async (event, message) => {
            const temp = Buffer.from(message.content, 'hex');
            client.send(temp, 1119, message.targetIP);
        })

        ipcMain.on('polling', (event, message) => {
            if (message.status) {
                polling.start(win, message.targetIP);
            } else {
                polling.stop();
            }
        })

        ipcMain.on('iface', async (event, message) => {
            if (message != '') {
                networkInterface = message
                console.log(message);
            } else {
                win.webContents.send('iface', os.networkInterfaces());
            }
        })

        client.on("message", (msg, rinfo) => {
            win.webContents.send('message', msg.toString())
            console.log(msg.toString())
            console.log(rinfo)
        })
    }

    end() {
        this.#client.close()
        this.#polling.end()
    }
}

export default IPCMainHandler;