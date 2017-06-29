$(function () {
	var $select_factory_wrapper = $('.select-factory-wrapper');  //选择水务局的模块
	var $water_value = $('.water-value');
	var $money_value = $('.money-value');
	var $user_value = $('.user-value');
	var $header_class = $('.header-class');
	var $table_no_data = $('.table-no-data');
	var $month_tbody = $('.month-tbody');
	var $pagination = $('.pagination');
	var $switch_input = $('.switch-input');
	var $switch_btn = $('.switch-btn');
	var $download = $('.download');

	var currentIndex;//当前所在页的页数

	/*获取session permission字段*/
	console.log(getStorage('permission'));
	initPage();

	function initClick() {
		$switch_btn.click(function () {
			var switch_input = $switch_input.val();
			if (switch_input === '') {
				console.log('请输入页数');
				alert('请输入页数');
			} else {
				CheckData(switch_input, 0);
			}
		});
		$download.attr('href', common_url + '/watersys/watersysDataTOExcel.do');

	}

	function initPage() {
		//1 电信 2 水务局
		var permission = getStorage('permission');
		switch (permission) {
			case '1':
				/*初始化页面*/
				CheckData(1, 1);
				break;
			default:
				$select_factory_wrapper.css('display', 'none');
				CheckData(1, 0);
				break;
		}

	}

	function CheckData(index, flag) {
		var check_data = 'index=' + index + '&flag=' + flag;
		console.log(check_data);
		$.ajax({
			type: 'POST',
			url: common_url + '/watersys/getWatersysDataByPage.do',
			data: check_data,
			dataType: 'json',
			timeout: 100000,
			context: document.body,
			success: function (data) {
				if (data.msg === 0) {
					console.log(data);
					renderTotalData(data);
					renderTable(data);
					renderPagination(data.currentpage, data.totalpage);
					initClick();
				} else {
					console.log('ajax 返回空');
				}
			},
			error: function (XMLHttpRequest) {
				console.log('ajax error');
			}
		});
	}

	function getStorage(key) {
		var value = sessionStorage.getItem(key);
		return value ? value : false;
	}

	function renderTotalData(data) {
		$water_value.text(data.totalAmount + '方');
		$money_value.text(data.totalPrice + '元');
		$user_value.text(data.userNum);
	}

	function renderTable(data) {
		var head = data.title;
		var body = data.pageData;

		$header_class.empty();
		$month_tbody.empty();
		$table_no_data.empty();

		$header_class.append($(
			'<th>' + '序号' + '</th>'
			+ '<th>' + head.waterMeterNum + '</th>'
			+ '<th>' + head.oldTotal + '</th>'
			+ '<th>' + head.nowTotal + '</th>'
			+ '<th>' + head.totalUse + '</th>'
			+ '<th>' + head.meterUserName + '</th>'
			+ '<th>' + head.meterUserId + '</th>'
			+ '<th>' + head.meterUserAddress + '</th>'
			// + '<th>' + head.meterPrint + '</th>'
			+ '<th>' + head.date1 + '</th>'
			+ '<th>' + head.date2 + '</th>'));

		console.log(body);
		console.log(data.currentpage);
		for (var i = 0; i < body.length; i++) {
			var tr = body[i];
			var index = i + 1 + (data.currentpage - 1) * 13;
			$month_tbody.append($('<tr>'
				+ '<td>' + index + '</td>'
				+ '<td>' + tr.waterMeterNum + '</td>'
				+ '<td>' + tr.oldTotal + '</td>'
				+ '<td>' + tr.nowTotal + '</td>'
				+ '<td>' + tr.totalUse + '</td>'
				+ '<td>' + tr.meterUserName + '</td>'
				+ '<td>' + tr.meterUserId + '</td>'
				+ '<td>' + tr.meterUserAddress + '</td>'
				// + '<td>' + tr.meterPrint + '</td>'
				+ '<td>' + tr.date1 + '</td>'
				+ '<td>' + tr.date2 + '</td>'
				+ '</tr>'));
		}
	}

	function renderPagination(current, total) {
		currentIndex = current;
		$pagination.empty();
		if (total <= 7) {
			for (var i = 1; i <= total; i++) {
				if (i === current) {
					$pagination.append($('<li class="active"><a class="pagination-index">' + i + '</a></li>'));
				} else {
					$pagination.append($('<li><a class="pagination-index">' + i + '</a></li>'));
				}
			}
			$pagination.prepend($('<li><a class="pre-page">&laquo;</a></li>'));
			$pagination.append($('<li><a class="next-page">&raquo;</a></li>'));

			bindIndexClick(current, total);
		} else {
			renderFlexPagination(current, total);
		}
	}

	function renderFlexPagination(c, t) {
		var current = c;
		var total = t;

	}

	function bindIndexClick(current, total) {
		var $pagination_index = $('.pagination-index');
		for (var i = 0; i < $pagination_index.length; i++) {
			(function (index) {
				$($pagination_index[index]).click(function (e) {
					var index_value = parseInt($(e.target).text());
					console.log(index_value);
					console.log(current);
					if (index_value === current) {

					} else {
						CheckData(index_value, 0);
					}
				});
			})(i);
		}
		$('.pre-page').click(function () {
			if (current === 1) {

			} else {
				CheckData(current - 1, 0);
			}
		});
		$('.next-page').click(function () {
			if (current === total) {

			} else {
				CheckData(current + 1, 0);
			}
		});
	}


});
