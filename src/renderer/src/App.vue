<script setup>
import { reactive, ref, watch } from 'vue';
import Versions from './components/Versions.vue'
import Xi from './components/Xi.vue';
import BT from './components/BT.vue';
import { da } from 'element-plus/es/locales.mjs';

const data = reactive({
    message: '',
    unitType: ['Xi', 'BT'],
    XiShow: false,
    BTShow: false
})
const send = async (message) => {
    console.log(message);
    window.electron.ipcRenderer.send('ping', message)
}
const value = ref('')

watch(value, (newValue, oldValue) => {
    console.log(newValue);
    switch (newValue) {
        case 'Xi':
            data.BTShow = false
            data.XiShow = true
            break;
        case 'BT':
            data.XiShow = false
            data.BTShow = true
            break;
        default:
            break;
    }
})
const options = ref([
    // {
    //     value: 'Xi',
    //     label: 'Xi',
    // },
    // {
    //     value: 'BT',
    //     label: 'BT',
    // },
])
const findDevice = () => {
    window.electron.ipcRenderer.send('find', 'a')
    options.value=[{
        value: 'Xi',
        label: 'Xi',
    }]
    console.log(options.value);
    
}

window.electron.ipcRenderer.on('message', (_event, value) => {
    data.message = value
})

window.electron.ipcRenderer.on('find', (_event, value) => {
    console.log(value)
})

// console.log(window.api.onUpdateCounter());

</script>

<template>
    <!-- <img alt="logo" class="logo" src="./assets/electron.svg" /> -->
    <div class="col-1">
        <!-- <div class="creator">Powered by electron-vite</div>
        <div class="text">
            Build an Electron app with
            <span class="vue">vue</span>
        </div>
        <p class="tip">Please try pressing <code>F12</code> to open the devTool</p> -->

        <el-select v-model="value" placeholder="Select" style="width: 100%" @click="findDevice()">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <div class="actions">
            <div class="action">
                <a @click="send('VERSION')">VERSION</a>
            </div>
            <div class="action">
                <a @click="send('GET ALL')">GET ALL</a>
            </div>
            <div class="action">
                <a @click="send('GET ALL')">RESET</a>
            </div>
        </div>
        <textarea readonly>{{ `${data.message}` }}</textarea>
    </div>
    <div class="col-2">
        <Xi v-if="data.XiShow" />
        <BT v-if="data.BTShow"/>
    </div>
    <Versions />

</template>

<style scoped>
select {
    height: 35px;
    background: rgba(255, 255, 255, 0);
    size: 5;
    outline: none;
}

option {
    /* background-color: black; */
    padding: 10px;
}
</style>
