$(function () {
	var $search_btn = $('.search-btn');  //搜索按钮
	var $search_tip = $('.search-tip');   //提示
	var $deviceNum_input = $('.deviceNum-input');  //表号输入框
	var $content_wrapper = $('.content-wrapper');   //表具信息内容
	var $device_num = $('.device-num'); //表号
	var $install_address = $('.install-address'); //安装地址
	var $username = $('.username'); //用户姓名
	var $tel = $('.tel'); //联系电话
	var $device_status = $('.device-status'); //阀门状态
	var $total_use = $('.total-use'); //累积用量
	var $home = $('.home'); //归属地
	var $install_time = $('.install-time'); //安装时间
	var $remaining_money = $('.remaining-money'); //剩余金额
	var $no_data = $('.no-data');

	/*搜索按钮的点击事件*/
	$search_btn.click(function () {
		var device_num = $deviceNum_input.val();
		if (device_num === '') {
			$search_tip.text('表号输入不能为空！');
			$search_tip.css('display', 'inline-block');
		} else {
			checkData(device_num);
		}
	});

	/*ajax请求*/
	function checkData(device_num) {
		var number_str = 'meterCode=' + device_num;
		console.log(number_str);
		$.ajax({
			type: 'POST',
			url: common_url + '/watersys/getDetailUserInfo.do',
			dataType: 'json',
			data: number_str,
			context: document.body,
			timeout: 5000,
			success: function (data) {
				console.log(data);
				if (data.msg === 0) {
					renderText(data);
				} else {
					console.log('数据库查询异常');
					// alert('数据库查询异常');
					$.showSuccessPop({
						msg: '数据库查询异常,请重试！',
						type: 'failure',
						autoHide: true
					});
				}
			},
			error: function () {
				console.log('ajax error');
				// alert('网络出错');
				$.showSuccessPop({
					msg: '网络错误，请重试！',
					type: 'failure',
					autoHide: true
				});
			}
		});
	}

	/*填充文字*/
	function renderText(data) {
		$no_data.css('display', 'none');
		$content_wrapper.css('display', 'block');
		$device_num.text(data.meterCode);
		$install_address.text(data.installAddress);
		$username.text(data.userName);
		$tel.text(data.userPhone);
		$device_status.text(data.valve);
		$total_use.text(data.totalAmount);
		$home.text(data.alongAddress);
		$install_time.text(data.installTime);
		$remaining_money.text(data.leftMoney);
	}
});