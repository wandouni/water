$(function () {
	var xAxis = [];
	var yAxis = [];
	var $start_year = $('.start-year');
	var $end_year = $('.end-year');
	var $year_item = $('.year-item');
	var $select_year_wrapper = $('.select-year-wrapper');
	var $search_btn = $('.search-btn');
	var $search_tip = $('.search-tip');
	var $year_tbody = $('.year-tbody');
	var $line_no_data = $('.line-no-data');
	var $table_no_data = $('.table-no-data');
	var $select_factory_input = $('.select-factory-input');
	var $select_factory_wrapper = $('.select-factory-wrapper');
	var permission;

	/*---------------初始化页面----------------*/
	// sessionStorage.setItem('permission', 1);
	/*初始化页面，区分电信和水务局*/
	initPage();

	function initPage() {
		//1 电信 2 水务局
		permission = getStorage('permission');
		console.log(permission);
		switch (permission) {
			case '1':
				/*初始化页面*/
				initFactoryList();
				break;
			default:
				$select_factory_wrapper.css('display', 'none');
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
				} else {
					alert('未查询到任何水务局信息');
					console.log('未查询到任何水务局信息！');
				}
			},
			error: function () {
				console.log('ajax error');
				alert('ajax error');
			}
		});
	}

	/*----------------搜索按钮的点击事件-------------------*/
	$search_btn.click(function () {
		var start_year_value = $start_year.val();
		var end_year_value = $end_year.val();
		if (start_year_value === '' || end_year_value === '') {
			$search_tip.text('年份输入不能为空！');
			$search_tip.css('display', 'inline-block');
		} else {
			$search_tip.css('display', 'none');
			var data;
			if (permission === '1') {
				data = 'startYear=' + (start_year_value || new Date().getFullYear())
					+ '&endYear=' + (end_year_value || new Date().getFullYear())
					+ '&managerId=' + $select_factory_input.val();
				checkData(data);
			} else {
				data = 'startYear=' + (start_year_value || new Date().getFullYear())
					+ '&endYear=' + (end_year_value || new Date().getFullYear());
				checkData(data);
			}
		}
	});

	function checkData(data) {
		console.log(data);
		/*请求数据*/
		$.ajax({
			type: 'POST',
			url: common_url + '/watersys/getUserDataByYear.do',
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
					var length = data.dataList.length;
					for (var i = 0; i < length; i++) {
						xAxis.push(parseInt(dataList[i].year));
						yAxis.push(parseInt(dataList[i].amountNum));
					}
					xAxis.push('');
					xAxis.unshift('');
					yAxis.push('');
					yAxis.unshift('');
					console.log(xAxis);
					console.log(yAxis);
					$line_no_data.css('display', 'none');
					$table_no_data.css('display', 'none');
					renderLine();
					renderTable(data, data.dataList);
				} else {
					alert('您所查询的年份没有数据');
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
		$year_tbody.empty();
		for (var j = 0; j < arr.length; j++) {
			(function (num) {
				var $tr = $('<tr><td>'
					+ (num + 1) + '</td><td>'
					+ arr[j].year + '</td><td>'
					+ arr[j].userNum + '</td><td>'
					+ arr[j].amountNum + '</td><td>'
					+ arr[j].priceNum + '</td></tr>');
				$year_tbody.append($tr);
			})(j);
		}
		$year_tbody.append($('<tr><td>总计</td><td></td><td>'
			+ data.userTotal + '</td><td>'
			+ data.amountTotal + '</td><td>'
			+ data.priceTotal + '</td></tr>'
		));
	}

	/*渲染折线图*/
	function renderLine() {
		var line_chart_wrapper = echarts.init(document.getElementById('year-line-wrapper'));
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
						res = (params.name)[1] + '年';
					} else {
						res = params.name + '年';
					}
					res += '<br/>' + params.value + '方';
					return res;
				},
				backgroundColor: '#529fff'
			}
		};
		line_chart_wrapper.setOption(option);
	}

	function getStorage(key) {
		var value = sessionStorage.getItem(key);
		return value ? value : false;
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
});