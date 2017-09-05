$(function () {
	var $device_num = $('.device-num');
	var $select_factory = $('.select-factory-input');
	var $select_factory_wrapper = $('.select-factory-wrapper');
	var $start_time = $('.start-time');
	var $end_time = $('.end-time');
	var $reason_select = $('.reason-select');
	var $handle_select = $('.handle-select');
	var $search_tip = $('.search-tip');
	var $search_btn = $('.search-btn');
	var $table_tbody = $('.table-tbody');
	var $table_no_data = $('.table-no-data');
	var $modal_wrapper = $('.modal-wrapper');
	var $device_num_text = $('.device-num-text');
	var $warning_type_text = $('.warning-type-text');
	var $warning_description_text = $('.warning-description-text');
	var $warning_time_text = $('.warning-time-text');
	var $dealTime_input = $('.dealTime-input');
	var $dealDescription_input = $('.dealDescription-input');
	var $dealDescription_text = $('.dealDescription-text');
	var permission;  //页面权限,表格信息数组
	var dataArray;  //页面权限,表格信息数组
	var isProcession = {
		'0': '未处理',
		'1': '已处理'
	};
	var isProcessionText = {
		'0': '去处理',
		'1': '已处理'
	};

	var mockdata = {
		"dataList": [
			{
				"alarmTypeId": 13,
				"installAddress": "蔡润国际大厦",
				"meterCode": "15901543770",
				"alarmDescripe": "超过透支限额",
				"alarmId": 1,
				"isProcession": 0,
				"alarmTime": 1496829823000
			},
			{
				"alarmTypeId": 1,
				"installAddress": "蔡润国际大厦",
				"meterCode": "15901543770",
				"alarmDescripe": "阀门故障，无法正常关闭",
				"alarmId": 2,
				"isProcession": 1,
				"alarmTime": 1497434740000
			}
		],
		"currentPage": "1",
		"totalPage": 3,
		'msg': 0
	};
	Mock.mock('mockdataurl', mockdata);

	// sessionStorage.setItem('permission', 1);

	initPage();

	function getDate(inputTime) {
		/*转换时间戳*/
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	}

	function initPagination(current, total, flag) {
		/*flag 0渲染导航 1不需要渲染导航*/
		console.log(current);
		console.log(total);
		var options = {
			"id": "page",//显示页码的元素
			"maxshowpageitem": 3,//最多显示的页码个数
			"pagelistcount": 10,//每页显示数据个数
			"callBack": function (next) {
				generateData(next, 1);
			}
		};
		page.init(10 * total, current, options);
	}

	function fillReasonSelect(arr) {
		reasonArray = arr;
		$reason_select.append($('<option>', {value: 0, text: "不限"}));
		for (var i = 0; i < arr.length; i++) {
			var option = $('<option>', {
				value: arr[i].at_id,
				text: arr[i].at_name
			});
			$reason_select.append(option);
		}
	}

	function fillDealSelect() {
		/* 0未处理 1已处理 2不限*/
		$handle_select.append($('<option>', {
			value: 2,
			text: '不限'
		}));
		$handle_select.append($('<option>', {
			value: 0,
			text: '未处理'
		}));
		$handle_select.append($('<option>', {
			value: 1,
			text: '已处理'
		}));
	}

	function fillFactory(arr) {
		for (var i = 0; i < arr.length; i++) {
			var option = $('<option>', {
				value: arr[i].managerId,
				text: arr[i].managerName
			});
			$select_factory.append(option);
		}
	}

	function fillTable(arr) {
		$(".table-tbody tr:not([class='table-no-data'])").remove();
		$table_no_data.css('display', 'none');
		for (var i = 0; i < arr.length; i++) {
			var $tr = $('<tr>', {
				'data-id': arr[i].alarmId
			});
			var $tds = $('<td>' +
				arr[i].meterCode + '</td><td>' +
				arr[i].alarmDescripe + '</td><td>' +
				getDate(arr[i].alarmTime) + '</td><td>' +
				isProcession[arr[i].isProcession] + '</td><td>' +
				arr[i].installAddress + '</td>');
			var $td_btn = $('<td>');
			$('<span>', {
				text: isProcessionText[arr[i].isProcession],
				'data-id': arr[i].alarmId,
				click: function () {
					console.log($(this).attr('data-id'));
					renderModal($(this).attr('data-id'), dataArray);
					console.log($(this).attr('data-id'));
				}
			}).appendTo($td_btn);
			$tr.append($tds);
			$tr.append($td_btn);
			$table_tbody.append($tr);
		}
	}

	function generateData(page, flag) {
		var data = 'startTime=' + $start_time.val() + '&endTime=' + $end_time.val() + '&page=' + page;
		if (permission === '1') {
			data += '&managerId=' + $select_factory.val();
		}
		if ($device_num.val().trim() !== '') {
			data += '&meterCode=' + $device_num.val();
		}
		if ($reason_select.val() !== '0') {
			data += '&alarmTypeId=' + $reason_select.val();
		}
		if ($handle_select.val() !== '2') {
			data += '&isPocession=' + $handle_select.val();
		}
		console.log(data);
		updateTable(data, flag);
	}

	// console.log(getNow());
	function getNow() {
		var date = new Date();
		return date.getFullYear() +
			'-' + returnTwo(date.getMonth() + 1) +
			'-' + returnTwo(date.getDate()) +
			' ' + returnTwo(date.getHours()) +
			':' + returnTwo(date.getMinutes()) +
			':00';
	}

	function returnTwo(num) {
		var num_str = num.toString();
		console.log(num_str.split('')[1]);
		if (num_str.split('')[1]) {
			return num_str;
		} else {
			return '0' + num;
		}
	}

	function renderModal(data_id, arr) {
		$('.submit-btn').off('click');
		$modal_wrapper.css('display', 'block');
		/*初始化时间选择*/

		$('.dealTime-input').fdatepicker({
			format: 'yyyy-mm-dd hh:ii:ss',
			pickTime: true,
			minuteStep: 5
		});

		/*填充4项文本*/
		var targetObj;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].alarmId === parseInt(data_id)) {
				targetObj = arr[i];
				break;
			}
		}
		$device_num_text.text(targetObj.meterCode);
		$warning_type_text.text(targetObj.alarmTypeId);
		$warning_description_text.text(targetObj.alarmDescripe);
		$warning_time_text.text(getDate(targetObj.alarmTime));

		if (parseInt(targetObj.isProcession) === 1) {
			/*已处理*/
			$('.dealTime-input').val(getDate(targetObj.processionTime));
			$('.dealTime-input').attr('disabled', 'disabled');

			$dealDescription_input.css('display', 'none');
			$dealDescription_text.css('display', 'inline-block');
			if (targetObj.processionDecrip === '') {
				$dealDescription_text.text("已处理");
			} else {
				$dealDescription_text.text(targetObj.processionDecrip);
			}

			$('.submit-btn').attr('disabled', 'disabled');
			$('.submit-btn').addClass('disabled');
		} else {
			/*未处理*/
			$dealTime_input.val(getNow());
			$('.dealTime-input').removeAttr('disabled');

			$dealDescription_input.css('display', 'inline-block');
			$dealDescription_text.css('display', 'none');
			$dealDescription_input.val("");

			$('.submit-btn').removeClass('disabled');
			$('.submit-btn').click(function () {
				bindSubmit(data_id, $(".dealTime-input").val(), $('.dealDescription-input').val(), arr);
				console.log('1111');
			});
		}

		/*给关闭按钮绑定点击事件*/
		$('.close-icon').click(function () {
			$modal_wrapper.css('display', 'none');
			$('.submit-btn').off('click');
		});
	}

	/*---------------------------------mock*/
	var submitData = {"msg": 0};
	Mock.mock('submitData', submitData);

	// console.log(new Date('2017-08-02 10:57:00').getTime());
	function bindSubmit(id, time, description, arr) {
		var data = 'alarmId=' + id + '&processionTime=' + new Date(time).getTime() + '&processionInfo=' + description;
		console.log(data);
		$.ajax({
			url: common_url + '/watersys/saveAlarmProcession.do',
			// url: 'submitData',
			data: data,
			dataType: 'json',
			type: 'POST',
			timeout: 5000,
			success: function (data) {
				console.log(data);
				if (data.msg === 0) {
					// alert('修改成功');
					$.showSuccessPop({
						msg: '修改成功',
						type: 'success',
						autoHide: true
					});
					console.log(id);
					console.log(arr);

					/*修改dataArray*/
					for (var i = 0; i < dataArray.length; i++) {
						if (dataArray[i].alarmId.toString() === id.toString()) {
							dataArray[i].isProcession = 1;
							dataArray[i].processionTime = time;
							dataArray[i].processionDecrip = description;
						}
					}
					reupdateTable(id);
					$modal_wrapper.css('display', 'none');
				} else {
					// alert("修改失败");
					$.showSuccessPop({
						msg: '修改失败，请重试！',
						type: 'failure',
						autoHide: true
					});
				}
			},
			error: function () {
				console.log('ajax error');
				// alert('网络错误！');
				$.showSuccessPop({
					msg: '网络错误，请重试！',
					type: 'failure',
					autoHide: true
				});
			}
		});
	}

	function getStorage(key) {
		var value = sessionStorage.getItem(key);
		return value ? value : false;
	}

	function updateTable(data, flag) {
		console.log(data);
		$.ajax({
			url: common_url + '/watersys/getAlarmInfo.do',
			// url: 'mockdataurl',
			data: data,
			dataType: 'json',
			type: 'POST',
			timeout: 5000,
			success: function (data) {
				console.log(data);
				if (data.msg === 0) {
					dataArray = data.dataList;
					fillTable(data.dataList);
					if (flag === 0) {
						initPagination(parseInt(data.currentPage), parseInt(data.totalPage), flag);
					}
				} else {
					console.log("查询结果为空");
					// alert("查询结果为空");
					$.showSuccessPop({
						msg: '查询结果为空',
						autoHide: true
					});
					showNodata();
				}
			},
			error: function () {
				console.log('ajax error');
				// alert('网络错误请重试！');
				$.showSuccessPop({
					msg: '网络错误，请重试！',
					type: 'failure',
					autoHide: true
				});
				showNodata();
			}
		});
	}

	function showNodata() {
		$(".table-tbody tr:not([class='table-no-data'])").remove();
		$('#page').empty();
		$table_no_data.css('display', 'table-row');
	}

	function reupdateTable(id) {
		var id_str = id.toString();
		$("span[data-id='" + id_str + "']").text('已处理');
		$("tr[data-id='" + id_str + "'] td:nth-child(4)").text("已处理");
	}

	function initPage() {
		/*1.获取permission, 1 电信 2 水务局 并初始化选择水厂*/
		permission = getStorage('permission');
		console.log(permission);
		switch (permission) {
			case '1':
				$select_factory_wrapper.removeClass('showFactory');
				$.ajax({
					url: common_url + '/watersys/getAllWatersysInfo.do',
					data: '',
					dataType: 'json',
					type: 'POST',
					timeout: 5000,
					success: function (data) {
						if (data.msg === 0) {
							console.log(data);
							fillFactory(data.dataList);
						} else {
							console.log("查询结果为空");
							$.showSuccessPop({
								msg: '查询结果为空',
								autoHide: true
							});
						}
					},
					error: function () {
						console.log('ajax error');
						// alert('网络错误');
						$.showSuccessPop({
							msg: '网络错误，请重试！',
							type: 'failure',
							autoHide: true
						});
					}
				});
				break;
			default:
				$select_factory_wrapper.addClass('showFactory');
				break;
		}

		/*2.预警类型选择*/
		$.ajax({
			url: common_url + '/watersys/getAllAlarmType.do',
			data: '',
			dataType: 'json',
			type: 'POST',
			timeout: 5000,
			success: function (data) {
				console.log(data);
				if (data.msg === 0) {
					console.log(data.dataList);
					fillReasonSelect(data.dataList);
				} else {
					console.log("查询结果为空");
					// alert("查询结果为空");
					$.showSuccessPop({
						msg: '查询结果为空',
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

		/*3.初始化时间选择*/
		$start_time.fdatepicker();
		$end_time.fdatepicker();

		/*4.初始化是否处理select*/
		fillDealSelect();

		/*5.搜索绑定点击事件*/
		$search_btn.click(function () {
			var checkResult = (function () {
				console.log($start_time.val());
				console.log($end_time.val());
				var a = (/^\d{0,}$/).test($device_num.val().trim());
				if (!a) {
					$search_tip.text('表号仅限输入数字！');
					$search_tip.css('display', 'block');
					return false;
				}
				if ($start_time.val() !== '' && $end_time.val() !== '') {
					$search_tip.css('display', 'none');
					return true;
				} else {
					$search_tip.text('起始时间不能为空！');
					$search_tip.css('display', 'block');
					return false;
				}
			})();
			if (checkResult) {
				generateData(1, 0);
			}
		});
	}
});