$(function () {
    $('form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '用户名验证失败',
                validators: {
                    notEmpty: {
                        message: '请输入用户名'
                    },
                    callback: {
                        message: '用户名不存在'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '请输入密码'
                    },
                    stringLength: {
                        min: 6,
                        max: 18,
                        message: '密码长度必须在6到18之间'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e) {
        e.preventDefault();
        var $form = $(e.target);
        // console.log($form.serialize());
        $.ajax({
            url:'/employee/employeeLogin',
            type:'post',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
                if (data.success) {
                    location.href = '/admin11/';
                } else {
                    if (data.error == 1000) {
                        //用户名不存在
                        /*NOT_VALIDATED 还没校验, VALIDATING 校验中, INVALID 失败 or VALID 成功*/
                        $form.data('bootstrapValidator').updateStatus('username','INVALID','callback');
                    } else if (data.error == 1001) {
                        //密码错误
                        $form.data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }
            }
        });
    });

});