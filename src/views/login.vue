<script setup lang="ts">
import { post,get } from '@/api/axios';
import api from '@/api/url'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import {userInfoStore}from'@/stores/counter'

const formDate = reactive({
  phone: '',
  captcha: '',
})
let timer:any = null
const $router = useRouter()
const getcaptcha = async()=>{
    const data = {phone:formDate.phone}
    try {
        const res = await post(api.getcaptcha,{data})
        console.log('getcaptcha',res)
        ElMessage({message:res.data?'success':'error',type:res.data?'success':'error'})
    } catch (error) {
        console.log(error)
    }
}

const login = async()=>{
    if(formDate.captcha==='')return ElMessage({message:"captcha not null!"})
    else {
        const data = {phone:formDate.phone,captcha:formDate.captcha}
        try {
            const r = await post(api.checkcaptcha,{data})
            // console.log('r..',r)
            if(r.data){
                try {
                    const res = await post(api.login,{data:{phone:formDate.phone,captcha:formDate.captcha}})
                    console.log('login...',res)
                    res.data?(document.cookie = res.cookie)&&$router.push('/music'):ElMessage({message:res.message,type:'error'})

                } catch (error) {
                    console.log(error)
                }
            }else return ElMessage({message:"plase check captcha!",type:'error'})
        } catch (error) {
            console.log(error)
        }
    }
    
}
const anonimousLogin = async()=>{
    try {
        const res = await post(api.anonimous,{})
        console.log('anonimous...',res)
        res.code===200&&(document.cookie = res.cookie)&&$router.push('/music')
    } catch (error) {
        console.log(error)
    }
}
const qr = ref(false)
const change =()=>{
    qr.value = !qr.value
    if(qr.value===false){
        getQr()
    }else{
        clearInterval(timer)
        timer = null
    }
}
const qrUrl = ref('')
const getQrKey = async()=>{
    try {
        const res = await get(api.getQrKey,{})
        console.log('qrkey..',res)
        if(res.code===200)return res.data.unikey
        else ElMessage({message:"error!",type:'error'})
    } catch (error) {
        console.log(error)
    }
}
const getQr = async()=>{
    const key = await getQrKey()
    try {
        const res = await post(api.getQr,{data:{key:key,qrimg:'qrimg'}})
        console.log('qr..',res)
        if(res.code===200){
            qrUrl.value = res.data.qrimg
            timer = setInterval(async()=>{
                const status = await checkQr(key)
                switch (status) {
                    case 800: getQr()
                    break;
                    case 801:''
                    break;
                    case 802:''
                    break;
                    case 803:clearInterval(timer)
                    break;
                }
            },2000)
        }else ElMessage({message:"error!",type:'error'})
    } catch (error) {
        console.log(error)
    }
}
const checkQr = async(key:string):Promise<number>=>{
    let code = 0
    try {
        const res = await get(api.checkQr,{params:{key:key}})
        console.log('check..',res)
        code = res.code
        if(res.code===803){
            document.cookie = res.cookie
            getLoginStatus(res.cookie)
            $router.push('/music')
        }
        // else ElMessage({message:"error!",type:'error'})
    } catch (error) {
        console.log(error)
    }
    return code
}

const $store = userInfoStore()
const getLoginStatus = async(cookie:string)=>{
    const data = {cookie}
    // const status = await post(api.status,{data})
    const account = await post(api.account,{data})
    // console.log('loginstatus...',status,account)
    console.log('acc..',account)
    $store.setUserInfo(account.profile)
}

onMounted(()=>{
    getQr()
})
</script>
<template>
    <div class="warp_box">
        <h3>wellcome login Ali-music</h3>
        <div class="box">
            <div class="change" @click="change">{{qr?'手机号':'扫码'}}</div>
            <template v-if="qr">
                <el-form :model="formDate" label-width="120px">
                    <el-form-item label="phone">
                        <el-input v-model="formDate.phone" placeholder="enter phone number" />
                    </el-form-item>
                    <el-form-item class="captcha" label="captcha">
                        <el-input v-model="formDate.captcha" placeholder="enter captcha"></el-input>
                        <el-button @click="getcaptcha">get captcha</el-button>
                    </el-form-item>
                </el-form>
                <div class="login-box">
                    <div class="login" @click="login">login</div>
                    <span class="anonimous" @click="anonimousLogin">anonimous login</span>
                </div>
            </template>
            <div class="qrbox" v-else>
                <img :src="qrUrl" alt="qr">
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.warp_box{
    width: 800px;
    height: 600px;
    margin: 100px auto;
    backdrop-filter: saturate(50%) blur(8px);
    background: rgba(255,255,255,.7);
    border: 1px solid #f2f2f2;
    box-shadow: 2px 4px 2px 4px #999;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h3{
        font-size: 18px;
        font-weight: 600;
        font-style: italic;
        text-align: center;
        padding: 10px 10px 20px;
    }
    .box{
        width: 400px;
        height: 300px;
        display: flex;
        flex-direction: column;
        :deep(.el-form-item__content){
            display: flex;
            flex-wrap: nowrap;
        }
        .login-box{
            width: 200px;
            align-self: flex-end;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 16px;
            font-weight: bold;
            .login{
                cursor: pointer;
                border: 1px solid #dcdfe6;
                background-color: #fff;
                color: #666;
                padding: 0 10px 2px;
                border-radius: 6px;
                &:hover,&:visited,&:focus{
                    color: #4fa5ff;
                    border-color: #ecf5ff;
                    background-color: #ecf5ff;
                }
            }
            .anonimous{
                cursor: pointer;
                color: #666;
                &:hover,&:visited,&:focus{
                    color: #000;
                }
            }

        }

        .change{
            width: 70px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            border: 1px solid #dcdfe6;
            background-color: #fff;
            color: #666;
            padding: 0 10px 2px;
            border-radius: 6px;
            align-self: flex-end;
            margin-bottom: 10px;
            &:hover,&:visited,&:focus{
                color: #4fa5ff;
                border-color: #ecf5ff;
                background-color: #ecf5ff;
            }
        }
        .qrbox{
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                border: 1px solid #4fa5ff;
                border-radius: 6px;
                box-shadow: 2px #f2f2f2;
            }
        }
    }
}
</style>