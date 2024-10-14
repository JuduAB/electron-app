import dgram from 'dgram'
import { Buffer } from 'node:buffer';

class Polling {
    constructor(client) {
        this.#client = client
    }

    #client;
    #intervalId;
    #message = Buffer.from("GET ALL", 'ascii');

    start(win,targetIP) {
        this.#client.on("message",msg => {
            win.webContents.send('polling', msg.toString())
        });
        this.#client.send(this.#message, 1119, targetIP)
        
        this.#intervalId = setInterval(() => {
            this.#client.send(this.#message, 1119, targetIP)
        }, 1000)
    }

    stop() {
        clearInterval(this.#intervalId)
        this.#client.removeAllListeners("message")
    }

    end(){
        this.#client.close()
    }
}

export default Polling;