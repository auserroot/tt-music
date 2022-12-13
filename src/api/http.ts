import axios from 'axios'
import type { AxiosRequestConfig , AxiosResponse  } from 'axios'
const server = axios.create()

console.log('baseUrl',import.meta.env)
server.defaults.baseURL = import.meta.env.VITE_API_BASE
server.defaults.timeout = 10000
server.defaults.withCredentials = true //cros

server.interceptors.request.use(
    (config:AxiosRequestConfig):AxiosRequestConfig => {
        let url = config.url

        //use neteasecloudapi need 
        if(url?.indexOf('?')!==-1){
            url += `&timestamp=${new Date().getTime()}`
        }else url += `?timestamp=${new Date().getTime()}`

        config.url = url
        return config
    },

    err =>{
        return Promise.reject(err)
    }
)

server.interceptors.response.use(
    (res:AxiosResponse):AxiosResponse =>{

        return res
    },
    err => {
        console.log(err)
        return Promise.reject(err)
    }

)

export default server