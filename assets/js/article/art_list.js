$(function () {
    var form = layui.form;
    var layer = layui.layer;
    //添加时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n < 10 ? "0" + n : n;
    }

    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    //初始化文章列表 GET获取表格数据渲染到页面template(模板内的值,提出来的值)
    initTable();
    //渲染到下拉框
    initCate();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res);
                console.log(res);
                $('tbody').html(str);
                //直接调用分页
                renderPage(res.total);
            }
        })
    }
    //把数据渲染到下拉框
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

    //筛选绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //赋值
        q.cate_id = cate_id
        q.state = state
        initTable();
    })

    //分页功能
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total,//数据总数，从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//默认选中的页面
            //分页模块显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7],

            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(first, obj.curr, obj.limit); //得到当前页，以便向服务端请求对应页的数据。
                //obj.limit得到每页显示的条数
                //赋值
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }

    //删除
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('恭喜你，删除文章成功！')
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index)
        })
    })


});
