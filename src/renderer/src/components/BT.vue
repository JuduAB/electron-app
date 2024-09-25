<script setup>
import { watch } from 'vue';
import { reactive } from 'vue'

// const versions = reactive({ ...window.electron.process.versions })
const data = reactive({
    pm:'',
    pmButType:''
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

const send = async (message) => {
    window.electron.ipcRenderer.send('ping', {content:message,targetIP:props.selectDevice.ip})
}

const SetPM = () =>{
    if(data.pm === '0'){
        send('SET PM 1')
    }else send('SET PM 0')
}

watch(()=>props.data,(n,o) => {
    data.pm = n.PM
})

watch(()=>data.pm,(n,o) => {
    if(n === '1'){
        data.pmButType = 'primary'
    }else data.pmButType = ''
})
</script>

<template>
    <div class="creator">{{ props.selectDevice.name + '-' + props.selectDevice.ip }}</div>
    <div class="container">
        <div class="buts">
            <el-button @click="send('SET VUP')"><el-icon><IEpPlus /></el-icon></el-button>
            <el-button @click="send('SET VDN')"><el-icon><IEpMinus /></el-icon></el-button>
            <el-button @click="send('SET PLY')"><el-icon><IEpVideoPlay /></el-icon></el-button>
            <el-button @click="send('SET PZ')"><el-icon><IEpVideoPause /></el-icon></el-button>
            <el-button @click="send('SET PRV')"><el-icon><IEpDArrowLeft /></el-icon></el-button>
            <el-button @click="send('SET NXT')"><el-icon><IEpDArrowRight /></el-icon></el-button>
            <el-button @click="SetPM()" :type="data.pmButType">配对</el-button>
            <el-button @click="send('SET DH')">断开</el-button>
        </div>
    </div>
</template>

<style scoped>
    .container{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .buts{
        width: 60%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap:20px;
        grid-row-gap:20px;
        justify-items: stretch;
    }
    .el-button+.el-button {
        margin-left: 0px;
    }
</style>
