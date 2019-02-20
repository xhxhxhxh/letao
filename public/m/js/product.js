$(function () {
    $('.lt_scroll').on('touchmove',function (e) {
        e.preventDefault();
    });
    mui('.mui-scroll-wrapper').scroll({
        indicators: false
    });

    //渲染网页
    // console.log(getParamsByURL())
    getProductData(function (data) {
        setTimeout(function () {
            var productTmpl = template('product-tmpl',data);
            $('.mui-scroll').html(productTmpl);
            mui('.mui-slider').slider({
                interval:2000
            });

            //添加数量与尺码选择事件
            $('.size').find('span').on('tap',function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
            $('.count span').on('tap',function () {
                var $input = $('.count').find('input');
                var count = $input.val();
                if ($(this).hasClass('jian')) {
                    if (count <= 0) {
                        mui.toast('购买数量已经最小了');
                        return;
                    }
                    count--;
                    $input.val(count);
                } else {
                    if (count >= parseInt($input.attr('data-max'))) {
                        setTimeout(function () {
                            mui.toast('超出最大购买数量');
                        },200);
                        return;
                    }
                    count++;
                    $input.val(count);
                }
            });

            //添加购物车功能
            $('.lt_cartAdd').on('tap',function () {
                var $size = $('.size span.active').html();
                var $count = $('.count input').val();
                var $maxCount = parseInt($('.count input').attr('data-max'));
                // console.log($size);
                if (!$size) {
                    mui.toast('请选择尺码');
                    return;
                }
                if ($count <= 0 || $count > $maxCount) {
                    mui.toast('请输入正确商品数');
                    return;
                }
                //提交购物车
                loginAjax({
                    url: '/cart/addCart',
                    type: 'post',
                    data: {
                        productId: getParamsByURL().productId,
                        num: $count,
                        size: $size
                    },
                    dataType: 'json',
                    success: function (data) {
                        mui.confirm('添加成功，去购物车看看？', '温馨提示',['取消','确认'], function(e) {
                            if (e.index == 1) {
                               location.href = '/m/user/cart.html';
                            } else {

                            }
                        });
                    }
                });

            });
        },1000);
    });
});

//获取产品详情
var getProductData = function (callback) {
    $.ajax({
        url:'/product/queryProductDetail',
        type:'get',
        data:{id:getParamsByURL().productId},
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
};