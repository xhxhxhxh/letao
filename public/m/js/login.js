$(function () {
    $('.submit').on('tap',function () {
        //校验用户名密码
        var username = $('#username').val();
        var passwords = $('#passwords').val();
        if (!username) {
            mui.toast('请输入用户名');
            return;
        }
        if (!passwords) {
            mui.toast('请输入密码');
            return;
        }

        //表单序列化
        var formSeri = $('form').serialize();
        var serializeObj = serializeToObject(formSeri);
        var returnUrl = location.search.replace('?returnURL=','');
        // console.log(returnUrl);
        // console.log(formSeri);
        //信息提交
        $.ajax({
            url:'/user/login',
            type:'post',
            data:serializeObj,
            dataType:'json',
            success:function (data) {
                console.log(data);
                if (data.error == 403) {
                    mui.toast(data.message);
                    return;
                }
                if (!returnUrl) {
                    location.href='/m/index.html';
                }else {
                    location.href = returnUrl;
                }
            }
        })
    });
});