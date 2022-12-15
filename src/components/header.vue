<script lang="ts" setup>
import { get } from '@/api/axios';
import api from '@/api/url';
import { onBeforeMount, provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import { saveKeywords } from '@/stores/counter'

let keybords = ref('')
const tit = import.meta.env.VITE_APP_TITLE
let $emit = defineEmits<{(e:'getMusicInfo',value:{songs:[]}):void}>()
// const $router = useRouter()
const $store = saveKeywords()
const searchParams = async (param:string)=>{
    // $router.push({
    //     params: {
    //         keywords:keybords.value?keybords.value:param,
    //     }
    // })
    // sessionStorage.setItem('keywords',keybords.value?keybords.value:param)
    $store.setKey(keybords.value?keybords.value:param)

    const params = {
        keywords:keybords.value?keybords.value:param,
        limit:30,
        // offset:(curPage - 1 )*30
    }
    try {
        const res = await get(api.getAllList,{params})
        console.log('..music',res)
        if(res.code===200){
            console.log('..............')
            $emit('getMusicInfo',res.result)
        }
    } catch (error) {
        console.log('..search..',error)
    }
}

const getHotList = async() =>{
    try{
        const res = await get(api.hotList,{})
        res.code===200&& $emit('getMusicInfo',res.result)
    }catch(err){
        console.log(err)
    }
}

onBeforeMount(()=>{
    // keybords.value = 'hot'
    // searchParams('hot')
    searchParams('热歌')
    // getHotList()
})
</script>
<template>
    <div class="header">
        <div class="tit">{{tit}}</div>
        <el-input class="input" v-model="keybords" @keydown.enter="searchParams" placeholder="Please enter params to search music" />
    </div>
</template>
<style lang="scss">
.header{
    width: 100%;
    height: 60px;
    background: rgba(255, 44, 44,.8);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px 8px 0 0;
    .tit{
        font-style: italic;
        font-weight: 600;
        font-size: 16px;
        color: whitesmoke;
    }
    .input{
        width: 70%;
    }
    .el-input__wrapper{
        border-radius: 16px;
    }
    .el-input__inner{
        text-indent: 14px;
        font-size: 16px;
        font-weight: 600;
        font-style: oblique;
        color: rgba(0, 0, 0,.6);
    }
}
</style>