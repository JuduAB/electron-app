<script setup>
import { reactive, onMounted } from 'vue'

const data = reactive({
    dGian1: 0,
    dGian2: 0,
    aGain1: 0,
    aGain2: 0,
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
    <div class="inputs">
        <p class="vue">输入模拟增益</p>
        <div>
            <input type="number" min="0" max="42" v-model="data.aGain1" />
            <input type="range" min="0" max="42" v-model="data.aGain1">
        </div>
        <div>
            <input type="number" min="0" max="42" v-model="data.aGain2" />
            <input type="range" min="0" max="42" v-model="data.aGain2">
        </div>
    </div>
    <div class="inputs">
        <p class="vue">输入数字增益</p>
        <div>
            <input type="number" min="-100" max="27" v-model="data.dGian1" />
            <input type="range" min="-100" max="27" v-model="data.dGian1">
        </div>
        <div>
            <input type="number" min="-100" max="27" v-model="data.dGian1" />
            <input type="range" min="-100" max="27" v-model="data.dGian2">
        </div>
    </div>
    <div class="inputs">
        <p class="vue">48V</p>
        <button @click="power(1)">48V</button>
        <button>48V</button>
    </div>


</template>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    width: 60px;
    height: 30px;
    display: block;
    background: transparent;
    color: aliceblue;
    border: 1px solid var(--color-background-mute);
    border-radius: 6px;
    outline: none;
    text-align: center
}

.inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 第一行一列 */
    grid-template-rows: auto;
    grid-row-gap: 10px;
    /* 自动调整高度 */
    margin-bottom: 20px;
    align-content: center;
    justify-items: center;
}

.inputs>div {
    display: grid;
    grid-row-gap: 10px;
    flex-direction: column;
    align-content: center;
    justify-items: center;
}
p{
    grid-column: span 2; 
    text-align: center;
}
.inputs>button{
    width: 50%;
    height: 30px;
}
</style>