/**
 * 用于获取地址栏参数
 * 返回值：{}；
 */
var getParamsByURL = function () {
    var paramsObj = {};
    var params = location.search;
    var newParams = params.substr(1);
    var paramsArr = newParams.split('&');
    paramsArr.forEach(function (item) {
        var itemArr = item.split('=');
        paramsObj[itemArr[0]] = itemArr[1];
    });
    return paramsObj;
};

/**
 * 跳转登陆页
 */

var loginUrl = '/m/user/login.html';
var loginAjax = function (params) {
    $.ajax({
        url:params.url || loginUrl,
        type:params.type || 'post',
        data:params.data || '',
        dataType: params.dataType || 'json',
        success:function (data) {
            if (data.error == 400) {
                location.href = loginUrl+'?returnURL='+location.href;
            } else {
                params.success && params.success(data);
            }
        },
        error:function () {
            mui.toast('服务器繁忙');
        }
    });
};

/**
 * 将序列化的字符串转化为obj
 */

var serializeToObject = function (params) {
    var paramsArr = params.split('&');
    var obj = {};
    paramsArr.forEach(function (item) {
        var itemArr = item.split('=');
        obj[itemArr[0]] = itemArr[1];
    });
    return obj;
};

/**
 * 获取购物车单个产品数据
 */

var getCartProductData = function (id,element) {
    var arr;
    element.data.forEach(function (item) {
        if (item.id == id) {
            arr = item;
            return;
        }
    });
    return arr;
};

/**
 * 删除购物车单个产品数据
 */
var deleteCartProductData = function (id,element) {
    element.data.forEach(function (item,i) {
        if (item.id == id) {
            element.data.splice(i,1);
        }
    });
};

var priceSum = function (idArr,element) {
    var sum = 0;
    idArr.forEach(function (item,i) {
        element.data.forEach(function (key,j) {
            if (item == key.id) {
                sum += key.num*key.price;
                return;
            }
        });
    });
    return sum;
};