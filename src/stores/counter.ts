import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
})

export const saveKeywords = defineStore('keywords',()=>{
  const key = ref('')
  const keywords = computed(()=>key.value)
  const setKey = (val:string)=>{
    key.value = val 
  }
  return {key,keywords,setKey}
})
interface user {
  nickname:string,
  userId:number,
  backgroundUrl:string,
  avatarUrl:string,
}
export const userInfoStore = defineStore('user',()=>{
  let user = ref<user>({
    nickname:'',
    userId:0,
    backgroundUrl:'',
    avatarUrl:''
  })
  const userInfo = computed(()=>{
    // return user.value?user.value:JSON.parse(sessionStorage.getItem('userInfo')||'')
    return sessionStorage.getItem('userInfo')?JSON.parse(sessionStorage.getItem('userInfo')||''):user.value
  })
  const setUserInfo = (val:user)=>{
    user.value = val
    sessionStorage.setItem('userInfo',JSON.stringify(val))
  }
  return {user,userInfo,setUserInfo}
})