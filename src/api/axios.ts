import axios from './http'

export const get = (url:string,{params = {}}={}):Promise<any>=>{
    return new Promise((resolve,reject)=>{
        axios({
            url,
            params,
            method:'get',
            responseType:'json'
        }).then((res)=>resolve(res.data))
        .catch((err)=>reject(err.data))
    })
}

export const post = (url:string,{data = {}}):Promise<any>=>{
    return new Promise((resolve,reject)=>{
        axios({
            url,
            data,
            method:'post'
        }).then((res)=>resolve(res.data))
        .catch((err)=>reject(err.data))
    })
}
