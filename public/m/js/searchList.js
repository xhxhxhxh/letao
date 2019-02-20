$(function () {
    // 页面初始化
    $('.lt_scroll').on('touchmove',function (e) {
        e.preventDefault();
    });
    mui('.mui-scroll-wrapper').scroll({
        // deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false
    });

    //1.还原搜索栏中的信息
    $('#search').val(getParamsByURL().key || '');

    //2.渲染产品区(放入下拉功能中)
    // getProductData({
    //     proName:getParamsByURL().key,
    //     page:1,
    //     pageSize:4
    // },function (res) {
    //     var tmplProduct = template('product_box',res);
    //     $('.lt_sports ul').html(tmplProduct);
    // });

    //3.搜索栏功能实现
    $('.lt_search a').on('tap',function () {
        var $key = $.trim($('.lt_search input').val());
        if ($key!=''){
            getProductData({
                proName:$key,
                page:1,
                pageSize:4
            },function (res) {
                var tmplProduct = template('product_box',res);
                $('.lt_sports ul').html(tmplProduct);
            });
        }else {
            mui.toast('请输入搜索内容');
        }
    }) ;

    //4.筛选栏样式
    $('.lt_filter a').on('tap',function () {
        var $this = $(this);
        if (!$this.hasClass('active')){
            $this.addClass('active').siblings().removeClass('active').find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
        } else {
            if ($this.find('.fa').hasClass('fa-angle-up')) {
                $this.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
            } else {
                $this.find('.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
            }
        }
        //根据筛选结果渲染页面(部分功能放入下拉刷新中)
        var productType = $this.data('type');
        var order = $this.find('.fa').hasClass('fa-angle-down')?2:1;
        var $key = $.trim($('.lt_search input').val());
        // var params = {
        //     proName:$key,
        //     page:1,
        //     pageSize:4
        // };
        // params[productType]=order;
        // if ($key!=''){
        //     getProductData(params,function (res) {
        //         var tmplProduct = template('product_box',res);
        //         $('.lt_sports ul').html(tmplProduct);
        //     });
        // }else {
        //     mui.toast('请输入搜索内容');
        // }
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    });

    //5.下拉刷新
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,
                callback :function () {
                    var $key = $.trim($('.lt_search input').val());
                    if ($key!=''){
                        var productType = $('.lt_filter a.active').data('type');
                        var order = $('.lt_filter a.active').find('.fa').hasClass('fa-angle-down')?2:1;
                        var params = {
                            proName:$key,
                            page:1,
                            pageSize:4
                        };
                        params[productType]=order;
                        getProductData(params,function (res) {
                            setTimeout(function () {
                                var tmplProduct = template('product_box',res);
                                $('.lt_sports ul').html(tmplProduct);
                                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                mui('#refreshContainer').pullRefresh().refresh(true);
                            },1000);
                        });
                    }else {
                        mui.toast('请输入搜索内容');
                    }
                }
            },

            //6.下拉加载
            up : {
                contentnomore:'没有更多数据了',
                callback:function () {
                    var $key = $.trim($('.lt_search input').val());
                    var productType = $('.lt_filter a.active').data('type');
                    var order = $('.lt_filter a.active').find('.fa').hasClass('fa-angle-down')?2:1;
                    var that = this;
                    window.page++
                    var params = {
                        proName:$key,
                        page:window.page,
                        pageSize:4
                    };
                    params[productType]=order;
                    if ($key!=''){
                        getProductData(params,function (res) {
                            setTimeout(function () {
                                if (res.data.length) {
                                    var tmplProduct = template('product_box',res);
                                    $('.lt_sports ul').append(tmplProduct);
                                    that.endPulldownToRefresh();
                                    that.endPullupToRefresh(false);
                                } else {
                                    that.endPullupToRefresh(true);
                                }

                            },1000);
                        });
                    }else {
                        mui.toast('请输入搜索内容');
                    }
                }

            }
        }
    });
});

//获取产品区数据
var getProductData = function (params,callback) {
    $.ajax({
        url:'/product/queryProduct',
        type:'get',
        data:params,
        dataType:'json',
        success:function (res) {
            window.page = res.page;
            callback && callback(res);
        }
    })
};

