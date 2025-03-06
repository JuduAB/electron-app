import dgram from 'dgram';
import packet from 'dns-packet';
import os from 'os';

function uniqueByIP(array) {
    const seen = new Set();
    return array.filter(item => {
        if (!item.ip || seen.has(item.ip)) {
            return false;
        }
        seen.add(item.ip);
        return true;
    });
}

const findDevice = (win,networkInterface) => {
    // 创建 UDP socket
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    // mDNS 组播地址和端口
    const MULTICAST_ADDRESS = '224.0.0.251';
    const MULTICAST_PORT = 5353;

    // 构建 mDNS 查询数据包
    const query = packet.encode({
        type: 'query',
        questions: [{
            type: 'PTR',
            name: '_netaudio-arc._udp.local' // 查找 Dante 服务
        }]
    });

    // 存储找到的设备信息
    let index = 0;
    let devices = [];

    // 监听 UDP 消息
    socket.on('message', (message, rinfo) => {
        const response = packet.decode(message);

        try {
            if (response.type === 'response' && response.additionals[0].name) {
                if (response.additionals[0].name.startsWith('DConBT') || response.additionals[0].name.startsWith('DConXi') || response.additionals[0].name.startsWith('DConXo')) {
                        const model = response.additionals[0].name.slice(0, 6);
                        const name = response.answers[0].data.replace(/._netaudio-arc._udp.local/g, "");
                        const ip = rinfo.address;
                        const temp = { name, ip, id: index, model };
                        index++;
                        devices.push(temp);
                }
            }
        } catch (error) {
            // console.error('Error processing message:', error);
        }
    });

    // 绑定并加入 mDNS 组播组
    socket.bind(MULTICAST_PORT, () => {
        const interfaces = os.networkInterfaces();

        try {
            socket.addMembership(MULTICAST_ADDRESS, networkInterface);
        } catch (err) {
            console.error(`Failed to join multicast group on ${iface.address}: ${err.message}`);
        }

        socket.setMulticastInterface(networkInterface)
        
        // 发送 mDNS 查询
        socket.send(query, 0, query.length, MULTICAST_PORT, MULTICAST_ADDRESS, (err) => {
            if (err) {
                console.error('Failed to send mDNS query:', err);
            } else {
                console.log('mDNS query sent');
            }
        });

    });

    // 定时停止监听
    setTimeout(() => {

        // 将找到的设备发送到渲染进程
        win.webContents.send('find', uniqueByIP(devices));

        // 退出 mDNS 组播组并关闭 socket
        try {
            socket.dropMembership(MULTICAST_ADDRESS, networkInterface);
        } catch (err) {
            console.error(`Failed to leave multicast group on ${iface.address}: ${err.message}`);
        }

        socket.close(() => {
            // console.log('Socket closed');
        });

    }, 1000); // 1 秒后停止监听
}

export { findDevice };