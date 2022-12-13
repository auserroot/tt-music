<script lang="ts" setup>
import { get } from '@/api/axios';
import api from '@/api/url';
import { toReactive } from '@vueuse/shared';
import { reactive, ref } from 'vue';

const songs = defineProps<{songs:{name:string,id:number,mv:number,al:{picUrl:string}}[],show:boolean}>()
let songList = toReactive(songs) 
const $emit = defineEmits<{(e:'getMusicUrl',value:number):void}>()
let src = ref('')
const playMusic = (item:{id:number,al:{picUrl:string}})=>{
    src.value = item.al.picUrl
    $emit('getMusicUrl',item.id)
    getLyric(item.id)
    getMsg(item.id)
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
    console.log('....lyric....',res)
  } catch (error) {
    console.log(error)
  }
}

const getMsg = async (id:number)=>{
  let params = {id:id,limit:100}
  try {
    const res = await get(api.getMsg,{params})
    console.log('....msg....',res)
    if(res.code===200){
       data.msgs =  res.comments
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
    <div class="content">
        <div class="left">
            <div class="music">
                <div class="item" v-for="item in songList.songs" :key="item.id" @click="playMusic(item)">
                    <span class="name">{{item.name}}</span>
                    <i class="mv" v-if="item.mv"><i class="cont"></i></i>
                </div>
            </div>
        </div>
        <div class="main">
            <img :class="show?'roaid rotate2':'roaid'" src="../assets/2.png" alt="music">
            <img :class="['musicp',show?'rotate1':'']" src="../assets/1.png" alt="music">
            <img class="pic" :src="src">
        </div>
        <div class="right">
            <div class="head-right">评论：</div>
            <div class="list" v-for="item in data.msgs" :key="item.commentId">
                <div class="user">
                    <div class="top">
                        <img :src="item.user.avatarUrl" alt="tou">
                        <span class="name">{{item.user.nickname}}</span>
                    </div>
                    <div class="content-text">{{item.content}}</div>
                    <div class="ip"><span class="time">{{item.timeStr}}</span>{{item.ipLocation.location}}</div>
                </div>
            </div>
        </div>
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
            background-color: #fff;
        }
        .list{
            padding: 10px;
            .user{
                background-color: #fff;
                padding: 10px;
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