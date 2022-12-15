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
  let user = reactive<user>({
    nickname:'',
    userId:0,
    backgroundUrl:'',
    avatarUrl:''
  })
  const userInfo = computed(()=>user)
  const setUserInfo = (val:user)=>{
    user = val 
  }
  return {user,userInfo,setUserInfo}
})