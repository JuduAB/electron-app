<script setup>
import { reactive } from 'vue';
import Versions from './components/Versions.vue'
import Xi from './components/Xi.vue';

const data = reactive({
    message: '',
})
const send = async (message) => {
    console.log(message);

    window.electron.ipcRenderer.send('ping', message)
}

window.electron.ipcRenderer.on('message', (_event, value) => {
    data.message = value
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

        <select name="" id="">
            <option value="1">1</option>
            <option value="2">2</option>
        </select>

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
        <Xi/>
    </div>
    <!-- <Versions /> -->
     
</template>

<style scoped>
select{
    height: 35px;
    background: rgba(255, 255, 255, 0);
    size: 5;
    outline: none;
}
option{
    /* background-color: black; */
    padding: 10px;
}

</style>
