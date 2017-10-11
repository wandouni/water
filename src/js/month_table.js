$(function () {
  var time;
  var xAxis = [];
  var yAxis = [];
  var old_first_year;//记录上一次列表的第一个元素值
  var check_year;   //查询的年份
  var $pre_year = $('.pre-year');   //三角上一个
  var $next_year = $('.next-year');   //三角下一个
  var $year_title = $('.year-title span');  //年的标题
  var $line_no_data = $('.line-no-data');
  var $table_no_data = $('.table-no-data');
  var $select_year = $('#select-year');  //选择年份下拉框
  var $select_time_icon = $('.select-time-icon');
  var $year_input = $('.year-input');
  var $year_item = $('.year-item');  //年列表
  var $year_item_li = $('.year-item li');  //年列表item
  var $confirm_btn = $('.confirm-btn');  //今年
  var $select_year_wrapper = $('.select-year-wrapper');
  var $search_btn = $('.search-btn'); //搜索按钮
  var $month_tbody = $('.month-tbody');
  var $select_factory_wrapper = $('.select-factory-wrapper');
  var $select_factory_input = $('.select-factory-input');
  var permission;

  //MOCK.JS
  var mockdata = {
    "dataList": [{
      "userNum": "2",
      "priceNum": "84.0",
      "month": "05",
      "amountNum": "268.89"
    }, {"userNum": "2", "priceNum": "28.0", "month": "06", "amountNum": "310.01"}],
    "amountTotal": 578.9,
    "userTotal": "2",
    "managerUser": [{"managerUserName": "21cn", "managerUserId": 2}, {
      "managerUserName": "世纪龙",
      "managerUserId": 4
    }, {"managerUserName": "番禺水厂", "managerUserId": 5}, {"managerUserName": "李先生", "managerUserId": 7}],
    "msg": 0,
    "priceTotal": 112.0
  }
  Mock.mock('http://g.cn', mockdata);

  sessionStorage.setItem('permission', 2);
  /*初始化页面，区分电信和水务局*/
  initPage();

  function initPage() {
    //1 电信 2 水务局
    permission = getStorage('permission');
    console.log(permission);
    switch (permission) {
      case '1':
        /*初始化页面*/
        $select_factory_wrapper.css('display', 'block');
        initFactoryList();
        break;
      default:
        $select_factory_wrapper.css('display', 'none');
        (function () {
          var data;
          if (permission === '1') {
            data = 'year=' + new Date().getFullYear() + '&managerId=' + $select_factory_input.val();
            console.log(data);
            checkData(data);
          } else {
            data = 'year=' + new Date().getFullYear();
            console.log(data);
            checkData(data);
          }
        })();
        break;
    }
  }

  function initFactoryList() {
    console.log('ajax21');
    $.ajax({
      type: 'POST',
      url: common_url + '/watersys/getAllWatersysInfo.do',
      dataType: 'json',
      context: document.body,
      data: '',
      timeout: 5000,
      success: function (data) {
        if (data.msg === 0) {
          console.log(data);
          renderFactoryList(data.dataList);
          (function () {
            var data;
            if (permission === '1') {
              data = 'year=' + new Date().getFullYear() + '&managerId=' + $select_factory_input.val();
              console.log(data);
              checkData(data);
            } else {
              data = 'year=' + new Date().getFullYear();
              console.log(data);
              checkData(data);
            }
          })();
        } else {
          // alert('未查询到任何水务局信息');
          console.log('未查询到任何水务局信息！');
          $.showSuccessPop({
            msg: '未查询到任何水务局信息',
            type: 'failure',
            autoHide: true
          });
        }
      },
      error: function () {
        console.log('ajax error');
        // alert('ajax error');
        $.showSuccessPop({
          msg: '网络错误，请重试！',
          type: 'failure',
          autoHide: true
        });
      }
    });
  }

  /*给输入框一个默认的时间，为今年*/
  $year_input.val(new Date().getFullYear());
  /*点击输入框，弹框出现*/
  $select_time_icon.click(function () {
    $year_input.focus();
    $select_year_wrapper.removeClass('none');
    generateYearlist();
  });
  $year_input.click(function () {
    $select_year_wrapper.removeClass('none');
    generateYearlist();
  });
  /*当点击其他地方的时候弹框消失*/
  $(document).click(function (event) {
    var target = event.target;
    var flag = $.inArray($select_year_wrapper[0], $(target).parents());
    if (target !== $select_year_wrapper[0] && target !== $year_input[0] && flag < 0 && target !== $select_time_icon[0]) {
      $select_year_wrapper.addClass('none');
    }
  });
  /*三角上的点击事件*/
  $pre_year.click(function () {
    generateYearlist(old_first_year - 1);
  });

  /*三角下的点击事件*/
  $next_year.click(function () {
    generateYearlist(old_first_year + 9);
  });

  /*生成默认年的列表，设置默认年的标题*/
  generateYearlist();

  /*更新年的列表*/
  function generateYearlist(last_y) {
    //清空
    $year_item.empty();
    var last_year = last_y || parseInt($year_input.val());
    var first_year = last_year - 4;
    old_first_year = first_year;
    $year_title.text(last_year);
    for (var i = first_year; i < last_year + 1; i++) {
      $('<li>' + i + '</li>').appendTo($year_item);
    }
    bindListclick();
  }

  /*年列表item的点击事件*/
  function bindListclick() {
    var $list = $('.year-item li');
    for (var i = 0; i < $list.length; i++) {
      (function (j) {
        $($list[j]).click(function (e) {
          check_year = $(e.target).text();
          // $year_title.text(check_year);
          $year_input.val(check_year);
          $select_year_wrapper.addClass('none');
        });
      })(i);
    }
  }

  /*今年按钮的点击事件*/
  $confirm_btn.click(function (e) {
    check_year = new Date().getFullYear();
    // $year_title.text(check_year);
    $year_input.val(check_year);
    $select_year_wrapper.addClass('none');
  });

  $search_btn.click(function () {
    var data;
    if (permission === '1') {
      data = ('year=' + $year_input.val() || (new Date().getFullYear()) ) + '&managerId=' + $select_factory_input.val();
      console.log(data);
      checkData(data);
    } else {
      data = 'year=' + $year_input.val() || (new Date().getFullYear());
      console.log(data);
      checkData(data);
    }
  });

  function checkData(data) {
    /*请求数据*/
    $.ajax({
      type: 'POST',
      url: 'http://g.cn',
      // url: common_url + '/watersys/getUserDataByMonth.do',
      dataType: 'json',
      context: document.body,
      data: data,
      timeout: 5000,
      success: function (data) {
        if (data.msg === 0) {
          console.log(data);
          xAxis = [];
          yAxis = [];
          var dataList = data.dataList;
          var listLength = data.dataList.length;
          for (var i = 0; i < listLength; i++) {
            xAxis.push(dataList[i].month);
            yAxis.push(dataList[i].amountNum);
          }
          xAxis.push('');
          xAxis.unshift('');
          yAxis.push('');
          yAxis.unshift('');
          console.log(xAxis);
          console.log(yAxis);
          $line_no_data.css('display', 'none');
          $table_no_data.css('display', 'none');
          renderView();
          renderTable(data, data.dataList);
        } else {
          renderNodata("无数据");
          // alert('您所查询的年份没有数据');
          console.log('未返回任何数据！');
          $.showSuccessPop({
            msg: '您所查询的年份没有数据',
            type: 'failure',
            autoHide: true
          });
        }
      },
      error: function () {
        renderNodata("网络错误");
        console.log('ajax error');
        // alert('网络错误');
        $.showSuccessPop({
          msg: '网络错误，请重试！',
          type: 'failure',
          autoHide: true
        });
      }
    });
  }

  function renderNodata(text) {
    /*显示表格空*/
    $month_tbody.empty();
    $month_tbody.append($('<tr class="table-no-data"> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> </tr>'));

    /*显示无数据*/
    $line_no_data.text(text);
    $line_no_data.css('display', 'block');
  }

  /*渲染表格*/
  function renderTable(data, arr) {
    $month_tbody.empty();
    for (var j = 0; j < arr.length; j++) {
      (function (num) {
        var $tr = $('<tr><td>'
          + (num + 1) + '</td><td>'
          + arr[j].month + '</td><td>'
          + arr[j].userNum + '</td><td>'
          + arr[j].amountNum + '</td><td>'
          + arr[j].priceNum + '</td></tr>');
        $month_tbody.append($tr);
      })(j);
    }
    $month_tbody.append($('<tr><td>总计</td><td></td><td>' + '</td><td>'
      + data.amountTotal + '</td><td>'
      + data.priceTotal + '</td></tr>'
    ));
  }

  /*渲染文字面板和折线图*/
  function renderView() {
    var line_chart_wrapper = echarts.init(document.getElementById('month-line-wrapper'));
    var option = {
      backgroundColor: '#fff',
      xAxis: {
        data: xAxis,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#dcdcdc',
            width: 2
          }
        },
        axisTick: {
          inside: true,
          alignWithLabel: true
        },
        axisLabel: {
          textStyle: {
            color: '#939393'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#ededed']
          }
        }
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#939393'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#ededed'],
            type: 'doted'
          }
        }
      },
      series: [{
        type: 'line',
        data: yAxis,
        itemStyle: {
          normal: {
            color: '#529fff'
          }
        },
        lineStyle: {
          normal: {
            color: '#529fff'
          }
        }
      }],
      tooltip: {
        trigger: 'item',
        formatter: function (params, ticket, callback) {
          console.log(params);
          var res;
          if ((params.name)[0] === '0') {
            res = (params.name)[1] + '月';
          } else {
            res = params.name + '月';
          }
          res += '<br/>' + params.value + '方';
          return res;
        },
        backgroundColor: '#529fff'
      }
    };
    line_chart_wrapper.setOption(option);
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

  function getStorage(key) {
    var value = sessionStorage.getItem(key);
    return value ? value : false;
  }
});