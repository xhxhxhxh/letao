$(function () {
    //下拉刷新
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,
                callback :function () {
                   var that = this;
                   setTimeout(function () {
                       //1.页面渲染
                       loginAjax({
                           url:'/cart/queryCartPaging',
                           type:'get',
                           data:{page:1,pageSize:100},
                           dataType:'json',
                           success:function (data) {
                               $('.mui-scroll ul').html(template('cart-tmpl',data));
                               window.cartData = data;
                               console.log(data);
                               that.endPulldownToRefresh();
                           }
                       });
                   },1000);

                }
            },

            //下拉加载
            up : {
                contentnomore:'没有更多数据了',
                callback:function () {
                    var that = this;
                    setTimeout(function () {
                        that.endPullupToRefresh(true);
                    },1000);

                }

            }
        }
    });

    //2.编辑功能

    $('.mui-table-view').on('tap','.mui-table-view-cell .mui-btn-blue',function () {
        //获取指定产品的价格和尺码
        var productId = $(this).parent().data('id');
        var productData = getCartProductData(productId,window.cartData);
        var html = template('cart-edit',productData);
        mui.confirm(html.replace(/\n/g,''), '编辑商品',['取消','确认'], function(e) {
            if (e.index == 1) {
                var size = $('.productSize').find('.active').html();
                var num = parseInt($('.productCount').find('input').val());
                productData.size = size;
                productData.num = num;
                loginAjax({
                    url:'/cart/updateCart',
                    type:'post',
                    data:{id:productId,size:size,num:num},
                    success:function (res) {
                        if (res.success) {
                            $('.mui-scroll ul').html(template('cart-tmpl',window.cartData));
                            productChecked.forEach(function (item,i) {
                                $('.productChoose').each(function (j,key) {
                                    if ($(key).data('id') == item) {
                                        $(key).prop('checked',true);
                                       return;
                                   }
                                });
                            });
                            $('.productChoose').trigger('change');
                            mui.closePopup();
                        }
                    }
                });
                return false;
            } else {

            }
        });
    });
    //添加数量与尺码选择事件
    $('body').on('tap','.productSize span',function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    $('body').on('tap','.productCount span',function () {
        var $input = $('.productCount').find('input');
        var count = $input.val();
        if ($(this).hasClass('jian')) {
            if (count <= 1) {
                mui.toast('购买数量已经最小了');
                return;
            }
            count--;
            $input.val(count);
        } else {
            if (count >= parseInt($input.attr('data-max'))) {
                mui.toast('超出最大购买数量');
                return;
            }
            count++;
            $input.val(count);
        }
    });

    //3.删除功能
    $('.mui-table-view').on('tap','.mui-table-view-cell .mui-btn-red',function () {
        var productId = $(this).parent().data('id');
        mui.confirm('你要删除这件产品吗？', '温馨提示',['取消','确认'], function(e) {
            if (e.index == 1) {
                var productIdArr = [];
                productIdArr.push(productId);
                loginAjax({
                    url:'/cart/deleteCart',
                    type:'get',
                    data:{id:productIdArr},
                    success:function (res) {
                        if (res.success) {
                            deleteCartProductData(productId,window.cartData);
                            $('.mui-scroll ul').html(template('cart-tmpl',window.cartData));
                            if (productChecked.includes(productId)) {
                                productChecked.splice(productChecked.indexOf(productId), 1);
                            }
                            productChecked.forEach(function (item,i) {
                                $('.productChoose').each(function (j,key) {
                                    if ($(key).data('id') == item) {
                                        $(key).prop('checked',true);
                                        return;
                                    }
                                });
                            });
                            $('.productChoose').trigger('change');
                            mui.closePopup();
                        }
                    }
                });
                return false;
            } else {

            }
        });
    });

    //4.价格计算功能
    var productChecked = [];
    $('.mui-table-view').on('change','.productChoose',function () {
        // console.log($(this).prop('checked'));
        var $this = $(this);
        if ($this.prop('checked')) {
            productChecked.includes($this.data('id')) || productChecked.push($this.data('id'));
        }else {
            if (productChecked.indexOf($this.data('id')) == -1) return;
            productChecked.splice(productChecked.indexOf($this.data('id')), 1);
        }
        // console.log(productChecked);
        var priceAll = priceSum(productChecked, window.cartData);
        $('.lt_priceAll span').html(Math.floor(priceAll*100)/100);
    });
});


