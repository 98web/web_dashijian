$(function () {
    //自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6位之间";
            }
        }
    });
    //用户渲染
    initUserInfo();
    //latui 的美化弹出
    var layer = layui.layer;
    //封装用户渲染函数
    function initUserInfo() {
        //get 获取用户的基本信息
        $.ajax({
            url: '/my/userinfo',
            //参数 无
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //成功 渲染（替换？）  formUserInfo form表单的class
                form.val("formUserInfo", res.data)
            }
        })

    }
    //表单重置
    $('#btnReset').on('click', function (e) {
        //阻止默认重置
        e.preventDefault();
        //从新渲染
        initUserInfo();
    })
    //基本资料填写修改用户资料
    $('.layui-form').on('submit', function (e) {
        //阻止默认提交
        e.preventDefault();
        //POST 更新用户的基本信息
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //成功
                layer.msg("恭喜你，修改用户信息成功！");
                //重点（★）调用父框架的全局方法//获取信息
                window.parent.getUserInfo();
                // parent() 方法返回被选元素的直接父元素

            }
        })
    })
})