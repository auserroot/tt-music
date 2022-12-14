<script lang="ts" setup>
import { get } from '@/api/axios';
import api from '@/api/url';
import { toReactive } from '@vueuse/shared';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import Mv from './mv.vue';

const songs = defineProps<{songs:{name:string,id:number,mv:number,al:{picUrl:string}}[],show:boolean}>()
let songList = toReactive(songs) 
const $emit = defineEmits<{(e:'getMusicUrl',value:number):void,(e:'getMusicInfo',value:{songs:[]}):void,(e:'stopMusic',value:string):void}>()
let src = ref('')
let id = ref(0)
let musicName = ref('')
let mvUrl = ref('')
let dialogVisible = ref(false)
let lyricListArr = ref<{id:number,lyric:string,lyricTime:string}[]>()
const close = (val:boolean)=>{
    dialogVisible.value = val
    mvUrl.value = ''
    document.querySelector('audio')?.play()
}
const playMusic = (item:{id:number,name:string,al:{picUrl:string}})=>{
    src.value = item.al.picUrl
    $emit('getMusicUrl',item.id)
    getLyric(item.id)
    getMsg(item.id)
    id.value = item.id
    musicName.value = item.name
}
interface msg {
    commentId:number,
    content:string,
    timeStr:string,
    ipLocation:{
        location:string
    },
    user:{
        avatarUrl:string,
        nickname:string
    }
}
let data = reactive<{msgs:Array<msg>}>({
   msgs:[]
})
const getLyric = async(id:number) =>{
  let params = {id:id}
  try {
    const res = await get(api.getLyric,{params})
    // console.log('....lyric....',res)
    res.code===200&&filterLyric(res.lrc.lyric)
  } catch (error) {
    console.log(error)
  }
}

//formater lyric 

type obj = {
    id:number
    lyricTime:string,
    lyric:string
}
const formaterTime = (val:string):string=>{
    const i = val.split('[')[1].split(']')[0]
    console.log(val,i)
    let m = parseInt(i.split(':')[0])
    let s = parseInt(i.split(':')[1].split('.')[0])
    let ms = i.split('.')[1]
    console.log(m,s,ms)
    let time = ''
    if(m>0){
        s += m*60
        time = s + '.' + ms
    }else{
        time = s + '.' + ms
    }
    return time
}
const filterLyric = (val:string)=>{
    // console.log('...lyric...',val)
    let lyricList = val.split('\n')
    console.log(lyricList)
    let arr: { id: number; lyricTime: string; lyric: string; }[] = []
    lyricList.map((item,index)=>{
        let obj:obj = {id:0,lyricTime:'',lyric:''}
        if(item!==''){
            let time = item.match(/\[\d{2}:\d{2}.\d{2,3}\]/)||''
            obj.lyricTime = formaterTime(time[0])
            obj.id = index+1
            obj.lyric = item.split(']')[1]
            arr.push(obj)
        }
    })
    console.log(arr)
    lyricListArr.value = arr
    // let lyricTimeList = lyricList.match(/\[\d{2}:\d{2}.\d{2,3}\]/)

}
//获取当前播放时间
// const getCurentTime = ()=>{
//     const el = document.querySelector('audio')
//     let time:number|undefined = 0
//     el.ontimeupdate = ($e)=>{
//         // console.log('$e',$e,el.currentTime)
//         time = el?.currentTime
//     }
//     return time
// }
let index = ref(0)
const active = ()=>{
    
    let time = document.querySelector('audio')?.currentTime||0
    let arr = lyricListArr.value
    
    arr?.forEach((item,ind)=>{
        if(time > Number(item.lyricTime)){
            index.value = ind

        }
    })
    
    console.log('$e',2)

}


const getMsg = async (id:number)=>{
  let params = {id:id,limit:30,offset:(curPage - 1 )*30}
  try {
    const res = await get(api.getMsg,{params})
    console.log('....msg....',res)
    if(res.code===200){
       data.msgs.push(...res.comments)
    }
  } catch (error) {
    console.log(error)
  }
}

const getMVurl = async (id:number) =>{
    const params = {id:id,r:1080}
    // try {
    //     const r = await get(api.getMvDetail,{params:{mvid:id}})
    //     console.log('////////////',r)
    // } catch (error) {
        
    // }
    const el = document.querySelector('audio')
    try {
        const res = await get(api.getMVurl,{params})
        console.log(res)
        res.code === 200&&(mvUrl.value = res.data.url)&&(dialogVisible.value=true)&&el?.pause()
    } catch (error) {
        console.log(error)
    }
}
let curPage = 1

const searchParams = async (param:string|null)=>{
    const params = {
        keywords:param,
        limit:30,
        offset:(curPage - 1 )*30
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
const param = sessionStorage.getItem('keywords')

const more = (flag:string) =>{
    let st:any = null
    let sh:any = null
    let ch:any = null
    if(flag==='music'){
         st = document.querySelector('.left')?.scrollTop
         sh = document.querySelector('.music')?.scrollHeight
         ch =  document.querySelector('.left')?.clientHeight
         if(sh -st +10 <=ch){
            console.log('.....//')
            curPage++
            searchParams(param)
        }
    }else {
         st = document.querySelector('.right')?.scrollTop
         sh = document.querySelector('.list')?.scrollHeight
         ch =  document.querySelector('.right')?.clientHeight
    
        if(sh -st + 10 <=ch){
            console.log('...../....')
            curPage++
            getMsg(id.value)
        }
    }
}

onMounted(()=>document.querySelector('audio')?.addEventListener('timeupdate',active))
onUnmounted(()=>document.querySelector('audio')?.removeEventListener('timeupdate',active))
</script>
<template>
    <div class="content">
        <div class="left" @scroll="more('music')">
            <div class="music">
                <div class="item" v-for="item in songList.songs" :key="item.id">
                    <span class="name" @click="playMusic(item)">{{item.name}}</span>
                    <i class="mv" v-if="item.mv" @click="getMVurl(item.mv)"><i class="cont"></i></i>
                </div>
            </div>
        </div>
        <div class="main">
            <img :class="show?'roaid rotate2':'roaid'" src="../assets/2.png" alt="music">
            <img :class="['musicp',show?'rotate1':'']" src="../assets/1.png" alt="music">
            <img class="pic" :src="src">

            <div class="lyric">
                <!-- <div v-for="(item,ind) in lyricListArr" :class="['lyric_item',index===ind?'lyric_active':'']" :style="index===ind?`display:block;transform: translateY(${-4}px)`:'display:none'"  :key="item.id">{{item.lyric}}</div> -->
                <div v-for="(item,ind) in lyricListArr" :style="index===ind?`display:block;transform: translateY(${-4}px)`:'display:none'"  :key="item.id">  
                    <p class="lyric_item lyric_active left" >{{item.lyric}}</p>
                    <p class="lyric_item right">{{lyricListArr?lyricListArr[ind+1]?.lyric:''}}</p>
                </div>
            </div>
        </div>
        <div class="right" @scroll="more('msg')">
            <div class="head-right">评论：</div>
            <div class="list">
                <div class="user" v-for="item in data.msgs" :key="item.commentId">
                    <div class="top">
                        <img :src="item.user.avatarUrl" alt="tou">
                        <span class="name">{{item.user.nickname}}</span>
                    </div>
                    <div class="content-text">{{item.content}}</div>
                    <div class="ip"><span class="time">{{item.timeStr}}</span>{{item.ipLocation.location}}</div>
                </div>
            </div>
        </div>

        <mv :musicName="musicName" :mvUrl="mvUrl" :dialogVisible="dialogVisible" @close="close"></mv>
    </div>
</template>
<style lang="scss">
.content{
    display: flex;
    width: 100%;
    height: 400px;
    .left{
        flex: 1;
        overflow-x: hidden;
        overflow-y: scroll;
        background-color: #f2f2f2;
        padding: 10px;
        .music{
            height: 100%;
            display: flex;
            flex-direction: column;
            .item{
                height: 40px;
                display: flex;
                justify-content: space-between;
                padding: 10px;
                margin: 6px 0;
                align-items: center;
                background-color: #fff;
                border-radius: 6px;
                cursor: pointer;
                .name{
                    width: 160px;
                    font-size: 14px;
                    font-style: italic;
                    font-weight: 500;
                }
                .mv{
                    width: 20px;
                    height: 20px;
                    border: 1px solid salmon;
                    border-radius: 6px;
                    .cont{
                        display: block;
                        width: 0;
                        margin: 3px auto;
                        border-left: 6px solid red;
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                    }
                }
            }
        }
    }
    .main{
        flex: 2;
        position: relative;
        // background-color: aquamarine;
        .roaid{
            margin: 10px 45% 0;
            position: absolute;
            z-index: 2;
            transform: rotate(-25deg);
            transform-origin: 12px 12px;
            transition: all 2s;
        }
        
        .musicp{
            width: 200px;
            height: 200px;
            position: absolute;
            left: 30%;
            top: 28%;
            z-index: 1;
        }
        .pic{
            width: 120px;
            height: 120px;
            border-radius: 50%;
            position: absolute;
            top: calc(28% + 40px);
            left: calc(30% + 40px);
            z-index: 0;
            object-fit: cover;
        }

        .lyric{
            height: 72px;
            width: 100%;
            line-height: 36px;
            overflow-y: hidden;
            overflow-x: visible;
            position: absolute;
            bottom: 0;
            .lyric_item{
                font-size: 14px;
                height: 36px;
                line-height: 36px;
                font-weight: 500;
                color: rgba(0,0,0,.8);
                background-color: #fff;
                overflow: hidden;
                padding: 0 12px;
            }
            .lyric_active{
                font-size: 16px;
                font-weight: bold;
                color: orange;
            }
            .left{
                text-align: left;
            }
            .right{
                text-align: right;
            }
        }
    }
    .right{
        flex: 1;
        // position: relative;
        overflow-x: hidden;
        overflow-y: scroll;
        background-color: #f2f2f2;
        .head-right{
            font-weight: 600px;
            font-size: 16px;
            font-style: italic;
            position: sticky;
            top: 0;
            z-index: 1;
            // background-color: #fff;
            height: 30px;
            line-height: 30px;
            backdrop-filter: saturate(50%) blur(8px);
            background: rgba(255,255,255,.7);

        }
        .list{
            padding: 10px;
            .user{
                background-color: #fff;
                padding: 10px;
                margin: 10px 0;
                border-radius: 6px;
                .top{
                    img{
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        object-fit: cover;
                    }
                    .name{
                        font-size: 10px;
                        font-weight: 500;
                    }
                }
                .content-text{
                    font-size: 14px;
                    font-weight: 500;
                    text-indent: 14px;
                }
                .ip{
                    text-align: right;
                    color: #999;
                    font-size: 12px;
                    .time{
                        font-size: 12px;
                        color: #666;
                    }
                }
            }
        }
    }

    .rotate2{
        transform: rotate(0deg) !important;
    }
    .rotate1{
        animation: r 5s linear infinite;
    }

    @keyframes r {
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
}
</style>