//拦截ajax请求
//开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
//处理参数
$.ajaxPrefilter(function (params) {
    //拼接对应的环境地址
    params.url = baseURL + params.url;


    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    //拦截所有响应
    params.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            //清空本地缓存
            localStorage.removeItem("token");
            //页面跳转
            location.href = "/login.html"
        }

    }
});