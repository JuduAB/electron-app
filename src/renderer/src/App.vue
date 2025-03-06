<script setup>
import { defineAsyncComponent, reactive, watch } from 'vue';
// import Versions from './components/Versions.vue'
import Xi from './components/Xi.vue';
import BT from './components/BT.vue';
import Iface from './components/Iface.vue';

const data = reactive({
    message: '',
    unitType: ['Xi', 'BT'],
    XiShow: false,
    BTShow: false,
    selectValue: undefined,
    options: [],
    decodedData: {},
    findButtonStatus:false
})
const send = async (content) => {
    if (data.selectValue === undefined) {
        ElMessage({
            message: '请选择设备',
            type: 'warning',
        })
        return;
    };
    
    window.electron.ipcRenderer.send('ping', { content: content, targetIP: data.selectValue.ip })
}

watch(() => data.selectValue, (newValue, oldValue) => {
    if (typeof newValue !== 'undefined') {
        switch (newValue.model) {
            case 'DConXi':
                data.BTShow = false
                data.XiShow = true
                break;
            case 'DConBT':
                data.XiShow = false
                data.BTShow = true
                break;
            default:
                break;
        }

        if (typeof oldValue === 'undefined') {
            window.electron.ipcRenderer.send('polling', { status: true, targetIP: newValue.ip })
        }else{
            window.electron.ipcRenderer.send('polling', { status: false, targetIP: oldValue.ip })
            window.electron.ipcRenderer.send('polling', { status: true, targetIP: newValue.ip })
        }
    } else {
        data.BTShow = false
        data.XiShow = false
        window.electron.ipcRenderer.send('polling', { status: false, targetIP: oldValue.ip })
    }
})

const findDevice = () => {
    data.findButtonStatus = true

    window.electron.ipcRenderer.send('find', 'a')

    data.options.length = 0;
    data.selectValue = undefined;
}

const getMAC = async () => {
    if (data.selectValue === undefined) {
        ElMessage({
            message: '请选择设备',
            type: 'warning',
        })
        return;
    };

    let temp = {
        targetIP: data.selectValue.ip
    }
    try {
        const result = await window.electron.ipcRenderer.invoke('dialog:getMAC', temp);
        if (result.error) {
            console.error('Error:', result.error);
            return;
        }
        
        ElMessage({
            message: '已复制',
            type: 'success',
        })

    } catch (error) {
        console.error('Error while getting MAC address:', error);
    }
}

window.electron.ipcRenderer.on('message', (_event, value) => {
    data.message = value
})

window.electron.ipcRenderer.on('find', (_event, value) => {
    data.options.length = 0;
    data.options.push(...value)
    data.findButtonStatus = false
})

window.electron.ipcRenderer.on('polling', (_event, value) => {
    let arr = value.split('ST ')
    arr.shift();
    let c = []
    if(data.selectValue.model === "DConXi" ){
        arr.forEach(element => {
            const a = element.split(" ")
            let key = a[1]
            let value = Number(a[2].replace(/\r|dB/g, ""))
            let obj = {[key]: value}
            c.push(obj)
        })
    }else if(data.selectValue.model === "DConBT"){
        arr.forEach(element => {
            const a = element.split(" ")
            let key = a[1]
            let value = a[2].replace(/\r|dB/g, "")
            let obj = {[key]: value}
            c.push(obj)
        })
    }
    
    data.decodedData = Object.assign({}, ...c)
})

const reset = () => {
    if (data.selectValue === undefined) {
        ElMessage({
            message: '请选择设备',
            type: 'warning',
        })
        return;
    };

    switch (data.selectValue.model) {
        case 'DConXi':
            window.electron.ipcRenderer.send('reset', {
                content: '5345542049473120300D5345542049473220300D5345542050503120300D5345542050503220300D534554204944473120300D534554204944473220300D53455420444E2030',
                targetIP: data.selectValue.ip
            })
            break;
        case 'DConBT':
            window.electron.ipcRenderer.send('reset', { 
                content: '53455420444E20300D534554204C4D20310D53455420434D20310D53455420424820300D53455420504220310D5345542042532044436F6E42540D53455420504320303030300D53455420504520300D ', 
                targetIP: data.selectValue.ip 
            })
            break;
        default:
            break;
    }
}
</script>

<template>
    <div class="versions">
        <li>V1.0.1-beta.3</li>
    </div>
    <div class="col-1">
        <div class="find">
            <el-select v-model="data.selectValue" placeholder="Select a device" style="width: 100%" value-key="id" clearable>
                <el-option v-for="item in data.options" :key="item.id" :label="item.name" :value="item">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{ item.ip
                        }}</span>
                </el-option>
            </el-select>
            <el-button @click="findDevice()" v-if="!data.findButtonStatus">查找设备</el-button>
            <el-button loading v-if="data.findButtonStatus"></el-button>   <!-- 使用:loading会挤压文字,暂时使用v-if -->
        </div>
        <div class="actions">
            <div class="action">
                <a @click="send('VERSION')">VERSION</a>
            </div>
            <div class="action">
                <a @click="send('GET ALL')">GET ALL</a>
            </div>
            <div class="action">
                <a @click="reset()">RESET</a>
            </div>
            <div class="action">
                <a @click="getMAC()">GET MAC</a>
            </div>
        </div>
        <textarea readonly>{{ data.message }}</textarea>
    </div>
    <div class="col-2">
        <Xi v-if="data.XiShow" :selectDevice="data.selectValue" :data="data.decodedData" />
        <BT v-if="data.BTShow" :selectDevice="data.selectValue" :data="data.decodedData" />
    </div>
    <!-- <Versions /> -->
    <Iface/>
</template>

<style scoped>
select {
    height: 35px;
    background: rgba(255, 255, 255, 0);
    size: 5;
    outline: none;
}

.find {
    display: grid;
    grid-template-columns: 77% 20%;
    grid-column-gap: 3%;
}
</style>
