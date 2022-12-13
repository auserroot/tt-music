<script lang="ts" setup>
import { toRef } from 'vue';

const porps = defineProps<{dialogVisible:boolean,musicName:string,mvUrl:string}>()
const emit = defineEmits<{(e:'close',value:boolean):void}>()
const close = ()=>{
    emit('close',false)
}
</script>
<template>
    <el-dialog v-model="porps.dialogVisible" title="MV" width="60%" center draggable>
        <span>{{musicName}}</span>
        <video class="video" :src="mvUrl" autoplay controls></video>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="close">Cancel</el-button>
        </span>
        </template>
  </el-dialog>
</template>

<style lang="scss">
    .video{
        width: 100%;
        margin: 0 auto;
    }
</style>