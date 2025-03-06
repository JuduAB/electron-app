<script setup>
import { reactive, ref } from 'vue'

const dialogFormVisible = ref(true)
const data = reactive({
    interfaces: [],
    selectValue: undefined,
})

window.electron.ipcRenderer.send('iface', "")

window.electron.ipcRenderer.on('iface', (_event, value) => {
    Object.keys(value).forEach((interfaceName) => {
        value[interfaceName].forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {

                const temp = {
                    name: interfaceName,
                    address: iface.address
                }
                data.interfaces.push(temp)
            } else {
                delete value[interfaceName]
            }
        })
    });
})

const primary = () => {
    if (data.selectValue === undefined) {
        ElMessage({
            message: '请选择网卡',
            type: 'warning',
        })
    } else {
        dialogFormVisible.value = false
        window.electron.ipcRenderer.send('iface', data.selectValue.address)
    }
}
</script>

<template>

    <!-- <el-button plain @click="dialogFormVisible = true">
        Open a Form nested Dialog
    </el-button> -->

    <el-dialog v-model="dialogFormVisible" title="选择网络接口" width="500" :close-on-click-modal="false" :show-close="false"
        :close-on-press-escape="false">
        <el-select v-model="data.selectValue" placeholder="选择使用的接口" value-key="address">
            <el-option v-for="item in data.interfaces" :key="item.address" :label="item.name" :value="item">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{
                    item.address }}</span>
            </el-option>
        </el-select>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="primary()">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
