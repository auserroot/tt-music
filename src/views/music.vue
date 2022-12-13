<script lang="ts" setup>
import Head from '@/components/header.vue';
import Foot from '@/components/footer.vue';
import Content from '@/components/content.vue';
import { reactive, ref } from 'vue';
import { get } from '@/api/axios';
import api from '@/api/url'
let data = reactive<{songs:Array<{id:number,name:string,mv:number,al:{picUrl:string}}>,url:string}>({
  url:'',
  songs:[]
})
const getMusicDetail = (val:{songs:Array<{id:number,name:string,mv:number,al:{picUrl:string}}>})=>{
  console.log('...music...',val)
  if(val.songs){
    data.songs = val.songs
  }
}
const getMusicList = (val:{songs:Array<{id:number,name:string,mv:number,al:{picUrl:string}}>})=>{
  if(val.songs){
    data.songs.push(...val.songs)
  }
}
const getMusicUrl = async (val:number)=>{
  console.log('...url...',val)
  // data.url = val
  const params = {id:val}
  try {
    const res = await get(api.getMusicUrl,{params})
    console.log('...url...',res)
    res.code===200&&(data.url = res.data[0].url)
  } catch (error) {
    console.log('...url..',error)
  }
}

let show = ref(false)
const getShow =(val:boolean)=>{
  show.value = val
}
</script>
<template>
  <div class="warp">
    <Head @getMusicInfo="getMusicDetail"></Head>
    <content @getMusicUrl="getMusicUrl" @getMusicInfo="getMusicList" :show="show" :songs="data.songs"></content>
    <foot @getShow="getShow" :musicUrl="data.url"></foot>
  </div>
</template>

<style lang="scss">
.warp{
  width: 800px;
  height: 600px;
  margin: 100px auto;

}
</style>
