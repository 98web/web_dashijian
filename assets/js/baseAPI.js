//拦截ajax请求
//开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
//处理参数
$.ajaxPrefilter(function (params) {
    //拼接对应的环境地址
    params.url = baseURL + params.url;
})