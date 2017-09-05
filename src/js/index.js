$(function () {
	console.log('%c惊不惊喜！意不意外！', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:12px;');

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
	var $select_factory_input = $('.select-factory-input');
	var $no_data = $('.no-data');
	var $table_content = $('.table-content');
	var permission;
	var firstLoad = false;

	var currentIndex;//当前所在页的页数

	/*获取session permission字段*/
	// sessionStorage.setItem('permission', '1');
	console.log(getStorage('permission'));
	initPage();

	function initPagination(current, total, flag) {
		/*flag 0渲染导航 1不需要渲染导航*/
		console.log(current);
		console.log(total);
		var options = {
			"id": "page",//显示页码的元素
			"maxshowpageitem": 3,//最多显示的页码个数
			"pagelistcount": 10,//每页显示数据个数
			"callBack": function (index) {
				var check_data;
				if (permission === '1') {
					check_data = 'index=' + index + '&managerUserId=' + $select_factory_input.val(); //flag代表是水务局还是电信
					CheckData(check_data, 1); //第二个参数代表是首页刷新和改变水务局时候的查询
				} else {
					check_data = 'index=' + index;
					CheckData(check_data, 1);
				}
			}
		};
		page.init(10 * total, current, options);
	}

	function initPage() {
		//1 电信 2 水务局
		permission = getStorage('permission');
		switch (permission) {
			case '1':
				/*初始化页面*/
				$select_factory_wrapper.css('display', 'block');
				generateData(1, 1);
				initValueChange(); //绑定select值改变触发的事件
				break;
			default:
				$select_factory_wrapper.css('display', 'none');
				generateData(1, 0);
				break;
		}

	}

	function initClick() {
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
				generateData(switch_input, 0);
			}
		});
		$download.attr('href', common_url + '/watersys/watersysDataTOExcel.do');

	}

	function generateData(index, flag) {
		var check_data;
		if (permission === '1') {
			check_data = 'index=' + index + '&flag=' + flag; //flag代表是水务局还是电信
			CheckData(check_data, 0); //第二个参数代表是首页刷新和改变水务局时候的查询
			initFactoryList('');
		} else {
			check_data = 'index=' + index + '&flag=' + flag;
			CheckData(check_data, 0);
		}
	}

	function initFactoryList(data) {
		$.ajax({
			type: 'POST',
			url: common_url + '/watersys/getAllWatersysInfo.do',
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
						type: 'failure',
						autoHide: true
					});
				}
			},
			error: function () {
				console.log('ajax error');
				// alert('网络错误，请重试！');
				$.showSuccessPop({
					msg: '网络错误，请重试！',
					type: 'failure',
					autoHide: true
				});
			}
		});
	}

	function initValueChange() {
		$select_factory_input.change(function () {
			console.log('changed');
			var data = 'index=1&' + 'managerUserId=' + $select_factory_input.val();
			console.log(data);
			CheckData(data);
		});

	}

	function CheckData(data, flag) {
		console.log(data);
		$.ajax({
			type: 'POST',
			url: common_url + '/watersys/getWatersysDataByPage.do',
			data: data,
			dataType: 'json',
			timeout: 100000,
			context: document.body,
			success: function (data) {
				if (data.msg === 0) {
					console.log(data);
					renderTotalData(data);

					$table_content.css('display', 'block');
					$no_data.css('display', 'none');
					renderTable(data);

					if (flag === 0) {
						initPagination(data.currentpage, data.totalpage, 0);
					}

					initClick();
				} else {
					console.log('ajax 返回空');
					// alert('ajax 返回空');
					$.showSuccessPop({
						msg: '无数据',
						autoHide: true
					});
					renderNoData();
				}
			},
			error: function (XMLHttpRequest) {
				console.log('ajax error');
				// alert('网络错误');
				$.showSuccessPop({
					msg: '网络错误',
					autoHide: true
				});
			}
		});
	}

	function renderNoData() {
		$water_value.text('---');
		$money_value.text('---');
		$user_value.text('---');
		$table_content.css('display', 'none');
		$no_data.css('display', 'block');
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
			var index = i + 1 + (data.currentpage - 1) * 10;
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

	/*function renderPagination(current, total) {
	 currentIndex = current;
	 $pagination.empty();
	 if (total <= 15) {
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
	 }*/

	/*	function renderFlexPagination(c, t) {
	 var current = c;
	 var total = t;

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
	 generateData(index_value, 0);
	 }
	 });
	 })(i);
	 }
	 $('.pre-page').click(function () {
	 if (current === 1) {

	 } else {
	 generateData(current - 1, 0);
	 }
	 });
	 $('.next-page').click(function () {
	 if (current === total) {

	 } else {
	 generateData(current + 1, 0);
	 }
	 });
	 }*/

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
});
