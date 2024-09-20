<script setup>
import { reactive, onMounted } from 'vue'

const data = reactive({
    dGian1:0,
    dGian2: 0,
    aGain1:0,
    aGain2:0,
    message: '',
})
onMounted(() => {
    const items = document.querySelectorAll('.option');

    items.forEach((item, index) => {
        item.value = index;
    })
})

const send = async (message) => {
    console.log(message);

    window.electron.ipcRenderer.send('ping', message)
}
const power = ch => {
    
}
</script>

<template>
    <div>编号：
        <select>
            <option v-for="(item, index) in 1000" value="index" class="option">{{ index }}</option>
        </select>
        <button>确认</button>
    </div>
    <div>
        信号：
        <span></span>
        <span></span>
    </div>
    <div>
        输入模拟增益：
        <apan>
            <input type="range" min="0" max="42" v-model="data.aGain1">
            <input type="number" min="0" max="42" v-model="data.aGain1"/>
        </apan>
        <apan>
            <input type="range" min="0" max="42" v-model="data.aGain2">
            <input type="number" min="0" max="42" v-model="data.aGain2"/>
        </apan>
    </div>
    <div>
        输入数字增益：
        <apan>
            <input type="range" min="-100" max="27" v-model="data.dGian1">
            <input type="number" min="-100" max="27" v-model="data.dGian1"/>
        </apan>
        <apan>
            <input type="range" min="-100" max="27" v-model="data.dGian2">
            <input type="number" min="-100" max="27" v-model="data.dGian1"/>
        </apan>
    </div>
    <div>
        48V
        <button @click="power(1)">48V</button>
        <button>48V</button>
    </div>


</template>
