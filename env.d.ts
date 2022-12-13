/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_TITLE:string,
    readonly VITE_API_BASE :string,//baseurl
}

interface ImportMate {
    readonly env:ImportMetaEnv
}