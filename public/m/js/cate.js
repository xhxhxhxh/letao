$(function () {
    $('.lt_scroll').on('touchmove',function (e) {
        e.preventDefault();
    });
    mui('.mui-scroll-wrapper').scroll({
        // deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false
    });
    //左侧列表渲染
    getFirstCateData(function (data) {
        var firstData = template('first_tmpl',data);
        $('.cate_left ul').html(firstData);
        //右侧内容渲染
        var listId = $('.cate_left .active').data('id');
        getSecondCateData({id:listId},function (data) {
            var secondData = template('second_tmpl',data);
            $('.cate_right ul').html(secondData);
        });
    });

    //注册标签点击事件
    $('.cate_left').on('click','li',function () {
        if ($(this).hasClass('active')) return;
        var currentId = $(this).data('id');
        getSecondCateData({id:currentId},function (data) {
            var secondData = template('second_tmpl',data);
            $('.cate_right ul').html(secondData);
        });
        $(this).addClass('active').siblings().removeClass('active');
    });
});

//获取一级标签数据
var getFirstCateData = function (callback) {
  $.ajax({
      url:'/category/queryTopCategory',
      type:'get',
      data:'',
      success:function (data) {
          callback && callback(data);
      }
  })
};

//获取二级标签数据
var getSecondCateData = function (id,callback) {
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:id,
        success:function (data) {
            callback && callback(data);
        }
    })
};