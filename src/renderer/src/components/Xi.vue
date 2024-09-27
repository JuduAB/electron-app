<script setup>
import { watch } from 'vue';
import { reactive, onMounted } from 'vue'

const data = reactive({
    IDG1: 0,
    IDG2: 0,
    IG1: 0,
    IG2: 0,
    message: '',
    pp1:0,
    pp2: 0,
    pp1Type:'',
    pp2Type:''
})

const props = defineProps({
    selectDevice: {
        type: Object,
        required: true,
    },
    data:{
        type:Object,
        required:true
    }
})
onMounted(() => {
    const items = document.querySelectorAll('.option');

    items.forEach((item, index) => {
        item.value = index;
    })
})

watch(()=>props.data,(n,o)=>{
    data.IDG1 = n.IDG1
    data.IDG2 = n.IDG2
    data.IG1 = n.IG1
    data.IG2 = n.IG2
    data.pp1 = n.PP1
    data.pp2 = n.PP2
    if (n.PP1) {
        data.pp1Type = 'success'
    }else{
        data.pp1Type = ''
    }
    if (n.PP2) {
        data.pp2Type = 'success'
    }else{
        data.pp2Type = ''
    }
})

watch(()=>data.IDG1,(n,o)=>{
    send({content:`SET IDG1 ${n}`,targetIP:props.selectDevice.ip})
})
watch(()=>data.IDG2,(n,o)=>{
    send({content:`SET IDG2 ${n}`,targetIP:props.selectDevice.ip})
})
watch(()=>data.IG1,(n,o)=>{
    send({content:`SET IG1 ${n}`,targetIP:props.selectDevice.ip})
})
watch(()=>data.IG2,(n,o)=>{
    send({content:`SET IG2 ${n}`,targetIP:props.selectDevice.ip})
})

const send = async (message) => {
    window.electron.ipcRenderer.send('ping', message)
}

const setPP1 = () =>{
    if(props.data.PP1) send({content:`SET PP1 0`,targetIP:props.selectDevice.ip})
    else send({content:`SET PP1 1`,targetIP:props.selectDevice.ip})
}
const setPP2 = () => {
    if(props.data.PP2){
        send({content:`SET PP2 0`,targetIP:props.selectDevice.ip})
    }else send({content:`SET PP2 1`,targetIP:props.selectDevice.ip})
}

</script>

<template>
    <div class="creator">{{ props.selectDevice.model + '-' + props.selectDevice.ip }}</div>
    <div class="inputs">
        <p class="vue">输入模拟增益</p>
        <div>
            <input type="number" min="0" max="42" v-model="data.IG1" />
            <input type="range" min="0" max="42" v-model="data.IG1">
        </div>
        <div>
            <input type="number" min="0" max="42" v-model="data.IG2" />
            <input type="range" min="0" max="42" v-model="data.IG2">
        </div>
    </div>
    <div class="inputs">
        <p class="vue">输入数字增益</p>
        <div>
            <input type="number" min="-100" max="27" v-model="data.IDG1" />
            <input type="range" min="-100" max="27" v-model="data.IDG1">
        </div>
        <div>
            <input type="number" min="-100" max="27" v-model="data.IDG2" />
            <input type="range" min="-100" max="27" v-model="data.IDG2">
        </div>
    </div>
    <div class="inputs">
        <p class="vue">48V</p>
        <el-button @click="setPP1()" :type="data.pp1Type">48V</el-button>
        <el-button @click="setPP2()" :type="data.pp2Type">48V</el-button>
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
    grid-template-rows: auto;
    grid-row-gap: 10px;
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