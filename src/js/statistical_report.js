$(function () {
  var $device_number_input = $('.device-number-input'); //表号输入框
  var $start_year = $('.start-year'); //开始年份输入框
  var $end_year = $('.end-year'); //截止年份输入框
  var $search_tip = $('.search-tip'); //输入提示
  var $search_btn = $('.search-btn'); //搜索按钮
  var $table_no_data = $('.table-no-data'); //无数据的表格的一行
  var $year_tbody = $('.year-tbody'); //tr插入到这个dom中
  var $pagination_wrapper = $('.pagination-wrapper'); //分页
  var $switch_input = $('.switch-input');
  var $switch_btn = $('.switch-btn');

  //MOCK.JS
  var mockdata = {
    "dataList": [{
      "time": "2017-05-31 15:48:32.0",
      "meterCode": "15901543770",
      "priceNum": "13.0",
      "amountNum": "23.0"
    }], "totalAmount": 23.0, "msg": 0, "totalPrice": 13.0, 'currentPage': 1
  }
  Mock.mock('http://g.cn', mockdata);

  initInput();
  initClick();

  function initInput() {
    $('.start-year').fdatepicker();
    $('.end-year').fdatepicker();
  }

  function initClick() {
    $search_btn.click(function () {
      var number = $device_number_input.val();
      var start_year = $start_year.val();
      var end_year = $end_year.val();
      if (number === '' || start_year === '' || end_year === '') {
        $search_tip.text('输入不能为空！');
        $search_tip.css('display', 'block');
      }
      else {
        checkData(number, start_year, end_year, 1);
      }
    });
  }

  function checkData(number, start_year, end_year, page) {
    var data = 'meterCode=' + number + '&startTime=' + start_year + '&endTime=' + end_year + '&page=' + page;
    console.log(data);
    /*请求数据*/
    $.ajax({
      type: 'post',
      url: 'http://g.cn',
      // url: common_url + '/watersys/getStatisticsReport.do',
      dataType: 'json',
      context: document.body,
      data: data,
      timeout: 5000,
      success: function (data) {
        if (data.msg === 0) {
          console.log(data);
          renderTable(data, data.dataList);
          renderPagination(data.currentPage, data.totalPage);
          initSwitchClick();
        } else {
          // alert('您所查询的年份没有数据');
          console.log('未返回任何数据！');
          $.showSuccessPop({
            msg: '您所查询的年份没有数据',
            autoHide: true
          });
        }
      },
      error: function (x) {
        // alert('网络出错，请重试！');
        console.log(x);
        $.showSuccessPop({
          msg: '网络错误，请重试！',
          type: 'failure',
          autoHide: true
        });
      }
    });
  }

  /*渲染表格*/
  function renderTable(data, arr) {
    console.log(data)
    $table_no_data.empty();
    $year_tbody.empty();
    for (var j = 0; j < arr.length; j++) {
      (function (num) {
        var $tr = $('<tr><td>'
          + ((data.currentPage - 1) * 10 + (num + 1)) + '</td><td>'
          + arr[j].meterCode + '</td><td>'
          + arr[j].amountNum + '</td><td>'
          + arr[j].priceNum + '</td><td>'
          + arr[j].time + '</td></tr>');
        $year_tbody.append($tr);
      })(j);
    }
    if (data.currentPage === data.totalPage) {
      $year_tbody.append($('<tr><td>总计</td>' +
        '<td></td><td>'
        + data.totalAmount + '</td><td>'
        + data.totalPrice + '</td><td>' + '</td>'
        + '</tr>'
      ));
    }
  }

  /*渲染分页*/
  function renderPagination(current, total, flag) {
    $pagination_wrapper.css('display', 'block');
    var options = {
      "id": "page",//显示页码的元素
      "maxshowpageitem": 3,//最多显示的页码个数
      "pagelistcount": 10,//每页显示数据个数
      "callBack": function (index) {
        checkData($device_number_input.val(), $start_year.val(), $end_year.val(), index);
      }
    };
    page.init(10 * total, current, options);
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
        checkData($device_number_input.val(), $start_year.val(), $end_year.val(), switch_input);
      }
    });
  }
});