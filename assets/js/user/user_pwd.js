$(function () {
    //自定义验证规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            "密码必须6到12位，且不能出现空格！"
        ],
        samepwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return "原密码和新密码不能相同！"
            }
        },
        repwd: function (value) {
            //[name=newPwd]  是赋值奥
            if (value !== $('[name=newPwd]').val()) {
                return "两次新密码输入不一致"
            }
        }

    });

    //form 表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        //POST  重置密码
        $.ajax({
            method: "POST",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg("修改密码成功！");
                //转为dom 操作  用reset()方法可把表单中的元素重置为它们的默认值。
                $('.layui-form')[0].reset();
            }
        })
    })
})