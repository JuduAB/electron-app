import dgram from 'dgram';
import packet from 'dns-packet';

const findDevice = (win) => {
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
            name: '_dante._tcp.local.' // 查找 Dante 服务
        }]
    });

    // 监听 UDP 消息
    socket.on('message', (message, rinfo) => {
        const response = packet.decode(message);
        const data = { response, rinfo}
        console.log('Received response:', response);
        win.webContents.send('find',data);
    });

    // 绑定并加入 mDNS 组播组
    socket.bind(MULTICAST_PORT, () => {
        socket.addMembership(MULTICAST_ADDRESS);

        // 发送 mDNS 查询
        socket.send(query, 0, query.length, MULTICAST_PORT, MULTICAST_ADDRESS, () => {
            console.log('mDNS query sent');
        });
    });

    // 定时停止监听，比如10秒后停止
    setTimeout(() => {
        console.log('Stopping listening...');

        // 退出 mDNS 组播组
        socket.dropMembership(MULTICAST_ADDRESS);

        // 关闭 socket，停止接收消息
        socket.close(() => {
            console.log('Socket closed');
        });
    }, 10000); // 10秒后停止监听
}

export { findDevice }