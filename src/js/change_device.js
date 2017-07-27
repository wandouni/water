$(function () {
	var $search_tip = $('.search-tip');
	var $search_btn = $('.search-btn');
	var $start_time = $('.start-time');
	var $end_time = $('.end-time');
	var $table_no_data = $('.table-no-data');
	var $year_tbody = $('.year-tbody');
	var $pageItem = $('.pageItem');

	/*mock.js*/
	var mockData = {
		"totalPage": 10,
		"currentPage": 1,
		"dataList": [{
			"total_amount": 355.01,
			"change_time": "2017-07-07 16:54:35",
			"wu_address": "蔡润国际大厦",
			"new_c_code": "15901543770",
			"old_c_code": "15912345676"
		}, {
			"total_amount": 355.01,
			"change_time": "2017-07-07 16:54:35",
			"wu_address": "蔡润国际大厦",
			"new_c_code": "15901543770",
			"old_c_code": "15912345676"
		}],
		"msg": 0
	};
	Mock.mock('http://g.cn', mockData);


	/*初始化选择时间插件*/
	initInput();
	function initInput() {
		$('.start-time').fdatepicker();
		$('.end-time').fdatepicker();
	}

	// initPagination();
	function initPagination(current, total, flag) {
		console.log(current);
		console.log(total);
		var options = {
			"id": "page",//显示页码的元素
			"maxshowpageitem": 3,//最多显示的页码个数
			"pagelistcount": 10,//每页显示数据个数
			"callBack": function (next) {
				if (flag === 1) {
					bindPaginationClick(next);
				}
			}
		};
		page.init(10 * total, current, options);
	}

	function checkTime() {
		console.log($start_time.val());
		console.log($end_time.val());
		if ($start_time.val() !== '' && $end_time.val() !== '') {
			$search_tip.text('');
			$search_tip.css('display', 'none');
			return true;
		} else {
			$search_tip.text('时间不能为空!');
			$search_tip.css('display', 'block');
			return false;
		}
	}

	function changeTable(arr) {
		$year_tbody.empty();
		$table_no_data.css('display', 'none');
		for (var i = 0; i < arr.length; i++) {
			var $tr = $('<tr><td>'
				+ arr[i].wu_address + '</td><td>'
				+ arr[i].change_time + '</td><td>'
				+ arr[i].old_c_code + '</td><td>'
				+ arr[i].new_c_code + '</td><td>'
				+ arr[i].total_amount + '</td>');
			$year_tbody.append($tr);
		}
	}

	function checkData(str, flag) {
		console.log(common_url + '/watersys/getChangeRecordInfo.do');
		console.log(str);
		$.ajax({
			// url: 'http://g.cn',
			url: common_url + '/watersys/getChangeRecordInfo.do',
			type: 'post',
			data: str,
			context: document.body,
			dataType: 'json',
			// jsonp: "jsonpcallback",
			timeout: 5000,
			success: function (data) {
				console.log(JSON.stringify(data));
				if (data.msg === 0) {
					changeTable(data.dataList);
					if (flag === 0) {
						initPagination(parseInt(data.currentPage), parseInt(data.totalPage, flag));
					}
				} else {
					console.log("查询结果为空或您的请求方式有错，请重试!");
					alert("查询结果为空或您的请求方式有错，请重试!");
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log('ajax error');
				alert("网络出错");
			}

		});
	}

	/*搜索绑定点击事件*/
	$search_btn.click(function () {
		var result = checkTime();
		if (result) {
			checkData('startTime=' + $start_time.val() + '&endTime=' + $end_time.val() + '&page=' + 1, 0);
		}
	});

	function bindPaginationClick(next) {
		/*分页的按钮的点击事件*/
		checkData('startTime=' + $start_time.val() + '&endTime=' + $end_time.val() + '&page=' + next, 1);
	}


});