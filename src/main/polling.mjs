import dgram from 'dgram'
import { Buffer } from 'node:buffer';

const message = Buffer.from("GET ALL", 'ascii');
const client = dgram.createSocket("udp4");

const polling = {


    intervalId:'',

    start: (win,targetIP) => {
        client.on("message", function (msg, rinfo) {
            win.webContents.send('polling', msg.toString())
        });
        client.send(message, 1119, targetIP)
        
        polling.intervalId = setInterval(() => {
            client.send(message, 1119, targetIP)
        }, 2000)
    },

    stop : () =>{
        clearInterval(polling.intervalId)
        client.removeAllListeners("message")
        // client.close()
    }
}




export {polling}