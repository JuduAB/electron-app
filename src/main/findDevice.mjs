import { error } from 'console';
import dgram from 'dgram';
import packet from 'dns-packet';

const findDevice = (win) => {
    // 创建 UDP socket
    let data = [];
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

    // 监听 UDP 消息
    let index = 0;
    socket.on('message', (message, rinfo) => {
        const response = packet.decode(message);
        try{
            if (response.type == 'response') {
                if(response.additionals[0].name.startsWith('DConBT') || response.additionals[0].name.startsWith('DConXi')){
                    const name = response.additionals[0].name.replace(/.local/g,"")
                    const ip = rinfo.address
                    const temp = { name, ip,id:index}
                    index++
                    data.push(temp)
    
                    // win.webContents.send('find',temp);
                }
            }
        }catch(error){
            console.log(error)
        }
        // console.log('Received response:', response);
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
        win.webContents.send('find',data);
        console.log('Stopping listening...');

        // 退出 mDNS 组播组
        socket.dropMembership(MULTICAST_ADDRESS);

        // 关闭 socket，停止接收消息
        socket.close(() => {
            console.log('Socket closed');
        });
        console.log(data);
        
    }, 1000); // 秒后停止监听
}

export { findDevice }