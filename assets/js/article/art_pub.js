$(function () {
    var form = layui.form;
    var layer = layui.layer;
    //把数据渲染到下拉框
    initCate();
    function initCate() {
        $.ajax({
            //获取文章分类列表
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()



    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //4点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    //5 设置图片
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]
        if (file == undefined) {
            return;
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //6设置状态
    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    //7添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append('state', state);
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {
                fd.append('cover_img', blob);
                publishArticle(fd);
            })
    })


    //封装添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜你，发布文章成功');

                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click();
                }, 1500)
            }
        })
    }

});
