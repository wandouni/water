$(function () {
	var $device_number_input = $('.device-number-input'); //表号输入框
	var $start_year = $('.start-year'); //开始年份输入框
	var $end_year = $('.end-year'); //截止年份输入框
	var $search_tip = $('.search-tip'); //输入提示
	var $search_btn = $('.search-btn'); //搜索按钮
	var $table_no_data = $('.table-no-data'); //无数据的表格的一行
	var $year_tbody = $('.year-tbody'); //tr插入到这个dom中

	initInput();
	initClick();

	function initInput() {
		$('.start-year').calendar();
		$('.end-year').calendar();
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
				checkData(number, start_year, end_year);
			}
		});
	}

	function checkData(number, start_year, end_year) {
		var data = 'meterCode=' + number + '&startTime=' + start_year + '&endTime=' + end_year;
		console.log(data);
		/*请求数据*/
		$.ajax({
			type: 'GET',
			url: common_url + '/watersys/getStatisticsReport.do',
			dataType: 'json',
			context: document.body,
			data: data,
			timeout: 5000,
			success: function (data) {
				if (data.msg === 0) {
					console.log(data);
					renderTable(data, data.dataList);
				} else {
					alert('您所查询的年份没有数据');
					console.log('未返回任何数据！');
				}
			},
			error: function (x) {
				// alert('网络出错，请重试！');
				console.log(x);
			}
		});
	}


	/*渲染表格*/
	function renderTable(data, arr) {
		$table_no_data.empty();
		$year_tbody.empty();
		for (var j = 0; j < arr.length; j++) {
			(function (num) {
				var $tr = $('<tr><td>'
					+ num + '</td><td>'
					+ arr[j].meterCode + '</td><td>'
					+ arr[j].amountNum + '</td><td>'
					+ arr[j].priceNum + '</td><td>'
					+ arr[j].time + '</td></tr>');
				$year_tbody.append($tr);
			})(j);
		}
		$year_tbody.append($('<tr><td>总计</td>' +
			'<td></td><td>'
			+ data.totalAmount + '</td><td>'
			+ data.totalPrice + '</td><td>' + '</td>'
			+ '</tr>'
		));
	}
});