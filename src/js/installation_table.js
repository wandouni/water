$(function () {
	var old_first_year;//记录上一次列表的第一个元素值
	var check_year;   //查询的年份
	var $pre_year = $('.pre-year');   //三角上一个
	var $next_year = $('.next-year');   //三角下一个
	var $year_title = $('.year-title span');  //年的标题
	var $line_no_data = $('.line-no-data');
	var $table_no_data = $('.table-no-data');
	var $select_year = $('#select-year');  //选择年份下拉框
	var $year_input = $('.year-input');
	var $year_item = $('.year-item');  //年列表
	var $year_item_li = $('.year-item li');  //年列表item
	var $confirm_btn = $('.confirm-btn');  //今年
	var $select_year_wrapper = $('.select-year-wrapper');
	var $search_btn = $('.search-btn'); //搜索按钮
	var $month_tbody = $('.month-tbody');

	/*给输入框一个默认的时间，为今年*/
	$year_input.val(new Date().getFullYear());
	/*点击输入框，弹框出现*/
	$year_input.click(function () {
		$select_year_wrapper.removeClass('none');
		generateYearlist();
	});
	/*当点击其他地方的时候弹框消失*/
	$(document).click(function (event) {
		var target = event.target;
		var flag = $.inArray($select_year_wrapper[0], $(target).parents());
		if (target !== $select_year_wrapper[0] && target !== $year_input[0] && flag < 0) {
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
		checkData($year_input.val());
	});

	function checkData(time) {
		var year = time || new Date().getFullYear();
		var data = 'year=' + year;
		/*请求数据*/
		$.ajax({
			type: 'POST',
			url: common_url + '/watersys/getMeterInstallInfo.do',
			dataType: 'json',
			context: document.body,
			data: data,
			timeout: 5000,
			success: function (data) {
				if (data.msg === 0) {
					console.log(data);
					renderTable(data, data.dataList);
				} else {
					alert('您所查询的年份没有数据！');
					console.log('未返回任何数据！');
				}
			},
			error: function () {
				console.log('ajax error');
			}
		});
	}

	/*渲染表格*/
	function renderTable(data, arr) {
		$month_tbody.empty();
		$table_no_data.css('display', 'none');
		for (var j = 0; j < arr.length; j++) {
			(function (num) {
				var $tr = $('<tr><td>'
					+ arr[j].installTime + '</td><td>'
					+ arr[j].meterCodeNum + '</td>');
				$month_tbody.append($tr);
			})(j);
		}
		$month_tbody.append($('<tr><td>总计</td><td>'
			+ data.totalNum + '</td></tr>'
		));
	}
});