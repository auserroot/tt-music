<script lang="ts" setup>
import { onMounted, ref, toRef, watch } from 'vue';

const porps = defineProps<{musicUrl:string,stopFlag:string}>()
const $emit = defineEmits<{(e:'getShow',value:boolean):void}>()

const handlerPause = ()=>{
    console.log('...pause..')
    $emit('getShow',false)
}
const handlerPlay = ()=>{
    console.log('...play..')
    $emit('getShow',true)
}

</script>
<template>
    <div class="footer">
        <audio :src="porps.musicUrl" autoplay controls @pause="handlerPause" @play="handlerPlay"></audio>
    </div>
</template>
<style lang="scss">
.footer{
    height: 80px;
    width: 100%;
    background-color: #f1f3f4;
    padding-top: 10px;
    audio{
        width: 100%;
    }
}
</style>