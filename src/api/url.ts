//music api
export default {
    getList:'/search',
    hot:'/search/hot',
    hotList:'/search/hot/detail',
    getAllList:'/cloudsearch',
    getMusicUrl:'/song/url',
    getMVurl:'/mv/url',
    getMvDetail:'/mv/detail',
    getLyric:'/lyric',//id
    getMsg:'/comment/music',//id ,limit,offset,before


    login:'/login/cellphone', 
    logout:'/logout',
    status:'/login/status',
    anonimous:'/register/anonimous',//游客状态
    getQrKey:'/login/qr/key',//获取二维码key
    getQr:'/login/qr/create',//生成二维码 key 可选参数: qrimg 传入后会额外返回二维码图片 base64 编码
    checkQr:'/login/qr/check',//校验扫码状态 key 800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
    reflush:'/login/refresh',//刷新状态
    getcaptcha:'/captcha/sent',// phone ctcode国家编码 获取验证码
    checkcaptcha:'/captcha/verify',//校验 phone captcha ctcode国家编码（可选）
} 