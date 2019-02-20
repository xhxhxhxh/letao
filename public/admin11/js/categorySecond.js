$(function () {
    window.page = 1;
    window.size = 2;
    var render = function () {
        getCateData(function (data) {
            //表格渲染
            var tableHtml = template('cateData',data);
            $('.table').html(tableHtml);

            //分页功能实现
            $('#pagination').bootstrapPaginator({
                bootstrapMajorVersion:3,
                size:'small',
                currentPage:window.page,
                numberOfPages:3,
                totalPages:Math.ceil(data.total/data.size),
                onPageClicked:function (event,originalEvent,type,page) {
                    window.page = page;
                    render();
                }
            });
        });
    };
    render();

    //一级分类目录
    getFirstCateData(function (data) {
        $('.dropdown-menu').html(template('firstCate',data)).find('li').on('click',function () {
            $('.chosen').html($(this).find('a').html());
            $('[name="categoryId"]').val($(this).data('id'));
            $('#addCategory').data('bootstrapValidator').updateStatus('categoryId','VALID');
        });
    });
    //图片上传
    initFileUpload();

    //信息校验
    $('#addCategory').bootstrapValidator({
        excluded:[],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    },
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入品牌名称'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e) {
        e.preventDefault();
        var $form = $(e.target);
        // console.log($form.serialize());
        $.ajax({
            url:'/category/addSecondCategory',
            type:'post',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
               if (data.success) {
                   window.page = 1;
                   render();
                   $('#addCate').modal('hide');
               }
            }
        });
    });
});

//获取二级分类数据
var getCateData = function (callback) {
  $.ajax({
      url:' /category/querySecondCategoryPaging',
      type:'get',
      data:{page:window.page,pageSize:window.size},
      dataType:'json',
      success:function (data) {
          // console.log(data);
          callback && callback(data);
      }
  });
};

//获取一级分类数据
var getFirstCateData = function (callback) {
    $.ajax({
        url:'/category/queryTopCategoryPaging',
        type:'get',
        data:{page:1,pageSize:100},
        dataType:'json',
        success:function (data) {
            // console.log(data);
            callback && callback(data);
        }
    });
};

//文件上传
var initFileUpload = function () {
    $('#image').fileupload({
        url:'/category/addSecondCategoryPic',
        dataType:'json',
        done:function (e,data) {
            // console.log(data);
            //图片显示
            $('#uploadImage').attr('src',data.result.picAddr);
            $('[name="brandLogo"]').val(data.result.picAddr);
            $('#addCategory').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
        
    });
};

