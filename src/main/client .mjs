import dgram from 'dgram'
import { Buffer } from 'node:buffer';

const message = Buffer.from("VERSION",'ascii');

const client = dgram.createSocket("udp4");

client.send(message, 0, message.length, 1119,
    "192.168.124.27", function (err, bytes) {
        if (err) console.log('发送数据失败。');
        else console.log("已发送 % d字节数据。", bytes);
    });
client.on("message", function (msg, rinfo) {
    console.log("已接收服务器端发送的数据", msg);

    console.log("已接收服务器端发送的数据", msg.toString());
    console.log("服务器地址为", rinfo.address);
    console.log("服务器所用端口为", rinfo.port);
});


export {client}