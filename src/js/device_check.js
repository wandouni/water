$(function () {
  var $select_factory_wrapper = $('.select-factory-wrapper');
  var $select_factory_input = $('.select-factory-input');
  var $device_number = $('.device-number'); //表号input
  var $install_address = $('.install-address'); //地址input
  var $search_btn = $('.search-btn');
  var $search_tip = $('.search-tip');
  var $year_tbody = $('.year-tbody');
  var $line_no_data = $('.line-no-data');
  var $table_no_data = $('.table-no-data');
  var $table_content = $('.table-content');
  var $pagination = $('.pagination');
  var $switch_input = $('.switch-input');
  var $switch_btn = $('.switch-btn');
  var device_number_value;
  var install_address_value;
  var factory_value;
  var isFirst = true;
  var permission;
  var factoryList;

  sessionStorage.setItem('permission', 2);

  //MOCK.JS
  var mockdata = {
    "totalPage": 1,
    "dataList": [{
      "price": 44.0,
      "earlyAmount": 213.0,
      "installAddress": "金坤",
      "meterCode": "11111111111",
      "priceType": "民用价格",
      "nowAmount": 324.0
    }, {
      "price": 44.0,
      "earlyAmount": 213.0,
      "installAddress": "金坤",
      "meterCode": "11111111111",
      "priceType": "民用价格",
      "nowAmount": 324.0
    }, {
      "price": 44.0,
      "earlyAmount": 213.0,
      "installAddress": "金坤",
      "meterCode": "11111111111",
      "priceType": "民用价格",
      "nowAmount": 324.0
    }, {
      "price": 44.0,
      "earlyAmount": 213.0,
      "installAddress": "金坤",
      "meterCode": "11111111111",
      "priceType": "民用价格",
      "nowAmount": 324.0
    }],
    "msg": 0
  }
  Mock.mock('http://g.cn', mockdata);

  /*初始化页面，区分电信和水务局*/
  initPage();

  function initPage() {
    //1 电信 2 水务局
    permission = getStorage('permission');
    console.log(permission);
    switch (permission) {
      case '1':
        /*初始化页面*/
        initFactoryList('');
        break;
      default:
        $select_factory_wrapper.css('display', 'none');
        break;
    }
    generateData('', '', 1);
    initClick();
  }

  function initClick() {
    $search_btn.click(function () {
      device_number_value = $device_number.val();
      install_address_value = $install_address.val();
      generateData(device_number_value, install_address_value, 1);
    });
  }

  function initSwitchClick() {
    $switch_btn.click(function () {
      var switch_input = $switch_input.val();
      if (switch_input === '') {
        console.log('请输入页数');
        // alert('请输入页数');
        $.showSuccessPop({
          msg: '请输入页数',
          type: 'failure',
          autoHide: true
        });
      } else {
        generateData($device_number.val(), $install_address.val(), switch_input);
      }
    });
  }

  function initPagination(current, total, flag) {
    /*flag 0渲染导航 1不需要渲染导航*/
    console.log(current);
    console.log(total);
    var options = {
      "id": "page",//显示页码的元素
      "maxshowpageitem": 3,//最多显示的页码个数
      "pagelistcount": 10,//每页显示数据个数
      "callBack": function (index) {
        var data;
        if (permission === 2) {
          data = 'meterCode=' + $('.device-number').val() + '&userAddress=' + $('.install-address').val() + '&page=' + index;
          console.log(data);
          checkData(data, 0);
        } else {
          var factoryId = $select_factory_input.val();
          data = 'meterCode=' + $('.device-number').val() + '&userAddress=' + $('.install-address').val() + '&managerId=' + factoryId + '&page=' + index;
          console.log(data);
          checkData(data, 0);
        }
      }
    };
    page.init(10 * total, current, options);
  }

  function generateData(number, address, page) {
    var data;
    if (permission === 2) {
      data = 'meterCode=' + number + '&userAddress=' + address + '&page=' + page;
      console.log(data);
      checkData(data, 0);
    } else {
      var factoryId = $select_factory_input.val();
      data = 'meterCode=' + number + '&userAddress=' + address + '&managerId=' + factoryId + '&page=' + page;
      console.log(data);
      checkData(data, 0);
    }
  }

  function initFactoryList(data) {
    $.ajax({
      type: 'POST',
      url: common_url + '/watersys/getAllWatersysInfo.do',
      // url: 'http://g.cn',
      dataType: 'json',
      context: document.body,
      data: data,
      timeout: 5000,
      success: function (data) {
        if (data.msg === 0) {
          factoryList = data.dataList;
          console.log(data);
          renderFactoryList(factoryList);
        } else {
          console.log('未查询到任何水务局信息');
          // alert('未查询到任何水务局信息');
          $.showSuccessPop({
            msg: '未查询到任何水务局信息',
            autoHide: true
          });
        }
      },
      error: function () {
        console.log('ajax error');
        // alert('网络出错');
        $.showSuccessPop({
          msg: '网络错误，请重试！',
          type: 'failure',
          autoHide: true
        });
      }
    });
  }

  function checkData(data, flag) {
    /*请求数据*/
    $.ajax({
      type: 'POST',
      url: 'http://g.cn',
      // url: common_url + '/watersys/getMeterInfo.do',
      dataType: 'json',
      context: document.body,
      data: data,
      timeout: 5000,
      success: function (data) {
        if (data.msg === 0) {
          renderTable(data, data.dataList);
          // renderPagination(data.currentPage, data.totalPage);
          if (flag === 0) {
            initPagination(data.currentPage, data.totalPage, 0);
          }
          initSwitchClick();
        } else {
          $table_content.css('display', 'none');
          // alert('未查询到此表具的相关信息！请检查输入！');
          console.log('未返回任何数据！');
          $.showSuccessPop({
            msg: '未查询到相关信息！请检查输入！',
            type: 'failure',
            autoHide: true
          });
        }
      },
      error: function () {
        console.log('ajax error');
        // alert('网络出错');
        $.showSuccessPop({
          msg: '网络错误，请重试！',
          type: 'failure',
          autoHide: true
        });
      }
    });
  }

  /*渲染厂商列表*/
  function renderFactoryList(factoryList) {
    for (var i = 0; i < factoryList.length; i++) {
      $select_factory_input.append($('<option>', {
        value: factoryList[i].managerId,
        text: factoryList[i].managerName
      }));
    }
    console.log($select_factory_input.val());
  }

  /*渲染表格*/
  function renderTable(data, arr) {
    $table_content.css('display', 'block');
    $table_no_data.css('display', 'none');

    $year_tbody.empty();

    for (var j = 0; j < arr.length; j++) {
      (function (num) {
        var $tr = $('<tr><td>'
          + ((num + 1) + (data.currentPage - 1) * 10) + '</td><td>'
          + arr[j].meterCode + '</td><td>'
          + arr[j].earlyAmount + '</td><td>'
          + arr[j].nowAmount + '</td><td>'
          + arr[j].price + '</td><td>'
          + arr[j].priceType + '</td><td>'
          + arr[j].installAddress + '</td></tr>');
        $year_tbody.append($tr);
      })(j);
    }
  }

  /*function renderPagination(current, total) {
   // currentIndex = current;
   $pagination.empty();
   if (total <= 5) {
   for (var i = 1; i <= total; i++) {
   if (i === current) {
   $pagination.append($('<li class="active"><a class="pagination-index">' + i + '</a></li>'));
   } else {
   $pagination.append($('<li><a class="pagination-index">' + i + '</a></li>'));
   }
   }
   $pagination.prepend($('<li><a class="pre-page">&laquo;</a></li>'));
   $pagination.append($('<li><a class="next-page">&raquo;</a></li>'));
   }
   bindIndexClick(current, total);
   }*/

  /*function bindIndexClick(current, total) {
   var $pagination_index = $('.pagination-index');
   for (var i = 0; i < $pagination_index.length; i++) {
   (function (index) {
   $($pagination_index[index]).click(function (e) {
   var index_value = parseInt($(e.target).text());
   console.log(index_value);
   console.log(current);
   if (index_value === current) {

   } else {
   generateData(device_number_value, install_address_value, index_value);
   }
   });
   })(i);
   }
   $('.pre-page').click(function () {
   if (current === 1) {

   } else {
   generateData(device_number_value, install_address_value, current - 1);
   }
   });
   $('.next-page').click(function () {
   if (current === total) {

   } else {
   generateData(device_number_value, install_address_value, current + 1);
   }
   });
   }*/

  function getStorage(key) {
    var value = sessionStorage.getItem(key);
    return value ? value : false;
  }
});