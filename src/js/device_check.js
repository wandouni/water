$(function () {
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

	initClick();

	function initClick() {
		$search_btn.click(function () {
			device_number_value = $device_number.val();
			install_address_value = $install_address.val();
			checkData(device_number_value, install_address_value, 1);
		});
	}

	function initSwitchClick() {
		$switch_btn.click(function () {
			var switch_input = $switch_input.val();
			if (switch_input === '') {
				console.log('请输入页数');
				alert('请输入页数');
			} else {
				checkData(device_number_value, install_address_value, switch_input);
			}
		});
	}

	function checkData(number, address, page) {
		var data = 'meterCode=' + number + '&userAddress=' + address + '&page=' + page;
		console.log(data);
		/*请求数据*/
		$.ajax({
			type: 'POST',
			url: common_url + '/watersys/getMeterInfo.do',
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
					$table_content.css('display', 'none');
					alert('未查询到此表具的相关信息！请检查输入！');
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
		$table_content.css('display', 'block');
		$table_no_data.css('display', 'none');

		$year_tbody.empty();

		for (var j = 0; j < arr.length; j++) {
			(function (num) {
				var $tr = $('<tr><td>'
					+ (num + 1) + '</td><td>'
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

	function renderPagination(current, total) {
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
						checkData(device_number_value, install_address_value, index_value);
					}
				});
			})(i);
		}
		$('.pre-page').click(function () {
			if (current === 1) {

			} else {
				checkData(device_number_value, install_address_value, current - 1);
			}
		});
		$('.next-page').click(function () {
			if (current === total) {

			} else {
				checkData(device_number_value, install_address_value, current + 1);
			}
		});
	}
});