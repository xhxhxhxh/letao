$(function () {
    //初始化渲染页面
    var historyData = template('tmpl',{list:getSearchHistory()});
    $('.searchHistory ul').html(historyData);
   $('.lt_search a').on('tap',function () {
       var $key = $.trim($('.lt_search input').val());
       if ($key!=''){
           location.href = 'searchList.html?key='+$key;
           setSearchHistory($key);
       }else {
           mui.toast('请输入搜索内容');
       }

   }) ;

   //删除数据
    $('body').on('tap','.history_del',function () {
        deleteHistory($(this).data('id'));
        historyData = template('tmpl',{list:getSearchHistory()});
        $('.searchHistory ul').html(historyData);
    }).on('tap','.allHistory_del',function () {
        deleteAllHistory();
        historyData = template('tmpl',{list:getSearchHistory()});
        $('.searchHistory ul').html(historyData);
    }).on('tap','.searchHistory li',function () {
        console.log($(this).data('key'));
        location.href = 'searchList.html?key='+$(this).data('key');
    });
});

//获取搜索记录
var getSearchHistory = function () {
    return JSON.parse(localStorage.getItem('leTaoSearchHistory') || '[]');
};

//设置搜索记录
var setSearchHistory = function (data) {
    var searchHistory = getSearchHistory();
    searchHistory.forEach(function (item) {
        if (item == data) {
            searchHistory.splice(searchHistory.indexOf(item),1);
            return;
        }
    });
    searchHistory.unshift(data);
    // console.log(searchHistory);
    // 最多10条记录
    if (searchHistory.length > 10) {
        searchHistory.pop();
    }
    localStorage.setItem('leTaoSearchHistory',JSON.stringify(searchHistory));
};

//删除单挑历史纪录
var deleteHistory = function (id) {
    var searchHistory = getSearchHistory();
    searchHistory.splice(id,1);
    localStorage.setItem('leTaoSearchHistory',JSON.stringify(searchHistory));
};

//删除所有历史纪录
var deleteAllHistory = function (id) {
    var searchHistory = getSearchHistory();
    searchHistory=[];
    localStorage.setItem('leTaoSearchHistory',JSON.stringify(searchHistory));
};