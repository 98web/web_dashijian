$(function () {
    getUserInfo();
    //退出
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清空本地缓存
            localStorage.removeItem("token");
            //页面跳转
            location.href = "/login.html"
            //关闭询问框
            layer.close(index);
        });
    })
})
//获取用户信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            renderAvatar(res.data)
        }
    })
}
//封装用户头像渲染函数
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').show().attr("src", user.user_pic);
        $('.user-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }
}
// getUserInfo()和renderAvatar(user)
// 必须是全局变量 因为后面要调用