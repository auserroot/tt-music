<script lang="ts" setup>
import { get, post } from '@/api/axios';
import api from '@/api/url';
import { onBeforeMount, provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import { saveKeywords, userInfoStore } from '@/stores/counter'

let keybords = ref('')
const tit = import.meta.env.VITE_APP_TITLE
let $emit = defineEmits<{(e:'getMusicInfo',value:{songs:[]}):void}>()
const $router = useRouter()
const $store = saveKeywords()
const $user = userInfoStore()
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
const isShow = ref(false)
const showLogout = ()=>{
    isShow.value = !isShow.value
}
const logout = async()=>{
    try {
        const res = await post(api.logout,{})
        console.log('退出',res)
        res.code===200&&$router.replace('/')
    } catch (error) {
        console.log(error)
    }
}
const login = ref(sessionStorage.getItem('login'))
onBeforeMount(()=>{
    // keybords.value = 'hot'
    // searchParams('hot')
    searchParams('热歌')
    // getHotList()
})
</script>
<template>
    <div class="header">
        <div class="tit" @mouseenter="showLogout" @mouseleave="showLogout">{{tit}}<span style="margin-left:12px;cursor:pointer" v-if="isShow" @click="logout">logout</span></div>
        <el-input class="input" v-model="keybords" @keydown.enter="searchParams" placeholder="Please enter params to search music" />
        <img v-if="login" :src="$user.userInfo.avatarUrl" draggable="false" alt="tou">
    </div>
</template>
<style lang="scss" scoped>
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
    img{
        width: 40px;
        border-radius: 50%;
    }
    .input{
        width: 70%;
    }
    :deep(.el-input__wrapper){
        border-radius: 16px;
    }
    :deep(.el-input__inner){
        text-indent: 14px;
        font-size: 16px;
        font-weight: 600;
        font-style: oblique;
        color: rgba(0, 0, 0,.6);
    }
}
</style>