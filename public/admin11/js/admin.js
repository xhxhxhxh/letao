$(function () {
    $(document).ajaxStart(function () {
        NProgress.start();
    }).ajaxStop(function () {
        NProgress.done();
    });

    //侧边栏隐藏
    $('[data-menu]').on('click',function () {
        $('.ad_aside').toggle();
        $('.ad_section').toggleClass('menu');
    });
    $('.child').parent().on('click',function () {
        $('.child').slideToggle();
    });

    //退出登录
    var logoutHtml ='<div class="modal fade logout">'+
                    '    <div class="modal-dialog modal-sm">'+
                    '        <div class="modal-content">'+
                    '            <div class="modal-header">'+
                    '                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>'+
                    '                <h4 class="modal-title">温馨提示</h4>'+
                    '            </div>'+
                    '            <div class="modal-body">'+
                    '                <p class="text-danger"><span class="glyphicon glyphicon-info-sign"></span> 您确定要退出后台管理系统吗？</p>'+
                    '            </div>'+
                    '            <div class="modal-footer">'+
                    '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
                    '                <button type="button" class="btn btn-primary btn-logout">确定</button>'+
                    '            </div>'+
                    '        </div>'+
                    '    </div>'+
                    '</div>';
    $('body').append(logoutHtml);
    $('[data-logout]').on('click',function () {
        $('.logout').modal('show');
    });
    //登出功能
    $('.btn-logout').on('click',function () {
        $.ajax({
            url:' /employee/employeeLogout',
            type:'get',
            data:'',
            success:function (data) {
                if (data.success) {
                    $('.logout').modal('hide');
                    location.href = '/admin11/login.html';
                }
            }
        });
    });
});