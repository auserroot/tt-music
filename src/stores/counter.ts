import { ref, computed } from 'vue'
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