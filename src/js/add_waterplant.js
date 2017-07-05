$(function () {
	var $info_tbody = $('.info-tbody'); //tbody
	var $no_data = $('.no-data'); //tbody
	var $add_plants = $('.add-plants'); //添加水务局按钮
	var $modal_wrapper = $('.modal-wrapper'); //模态窗浅灰色背景
	var $submit_wrapper = $('.submit-wrapper'); //模态窗主体
	var $close_icon = $('.close-icon'); //关闭按钮
	var $submit_btn = $('.submit-btn'); //提交按钮
	var $account_input = $('.account-input'); //账号
	var $name_input = $('.name-input'); //名称
	var $address_input = $('.address-input'); //地址
	var $password_input = $('.password-input'); //密码
	var account_flag = false, name_flag = false, address_flag = false, password_flag = false;
	var $tip_wrapper = $('.tip-wrapper'); //填写tip

	initPage();

	function initPage() {
		/*1.获取session,判断是哪个角色*/
		var permission = getStorage('permission');
		console.log(permission);
		if (permission === false) {
			//重定向至首页
			// window.location.href = '../../manager/index.html';
		}

		/*2.查询水务局列表*/
		checkList();

		/*3.初始化添加水务局按钮的点击事件,关闭按钮，提交按钮的点击事件,四个输入框的输入监听*/
		$add_plants.click(function () {
			$modal_wrapper.fadeIn('slow');
		});

		$close_icon.click(function () {
			/*重置模态框的状态，包括填写的内容和按钮的状态*/
			resetModal();
			$modal_wrapper.fadeOut('slow');
		});

		$submit_btn.click(function () {
			if (account_flag && name_flag && address_flag && password_flag) {
				submitWaterInfo();
			} else {
				$tip_wrapper.text('您还有信息未填写！');
				$tip_wrapper.css('display', 'block');
			}
		});

		$account_input.blur(function () {
			if ($account_input.val() !== '') {
				account_flag = !account_flag;
			} else {
				account_flag = false;
				$tip_wrapper.text('账号输入不能为空！');
				$tip_wrapper.css('display', 'block');
			}
		});
		$name_input.blur(function () {
			if ($name_input.val() !== '') {
				name_flag = !name_flag;
			} else {
				name_flag = false;
				$tip_wrapper.text('名称输入不能为空！');
				$tip_wrapper.css('display', 'block');
			}
		});
		$address_input.blur(function () {
			if ($address_input.val() !== '') {
				address_flag = !address_flag;
			} else {
				address_flag = false;
				$tip_wrapper.text('地址输入不能为空！');
				$tip_wrapper.css('display', 'block');
			}
		});
		$password_input.blur(function () {
			if (checkNewpassword()) {
				password_flag = !password_flag;
			} else {
				password_flag = false;
				$tip_wrapper.text('密码输入不能为空！');
				$tip_wrapper.css('display', 'block');
			}
		});

		$password_input.bind('input propertychange', checkNewpassword);
	}

	function getStorage(key) {
		var value = sessionStorage.getItem(key);
		return value ? value : false;
	}

	function checkList() {
		$.ajax({
			url: common_url + '/watersys/getAllWatersysInfo.do',
			type: 'POST',
			data: '',
			dataType: 'json',
			timeout: 5000,
			context: document.body,
			success: function (data) {
				console.log(data);
				if (data.msg === 0) {
					/*渲染表格*/
					renderTable(data.dataList);
				} else {
					console.log('返回信息不存在');
				}
			},
			error: function () {
				console.log('网络异常！');
			}
		});
	}

	function renderTable(arr) {
		$no_data.css('display', 'none');
		for (var j = 0; j < arr.length; j++) {
			(function (num) {
				var $tr = $('<tr><td>'
					+ (num + 1) + '</td><td>'
					+ arr[j].managerId + '</td><td>'
					+ arr[j].managerName + '</td><td>'
					+ arr[j].managerAccess + '</td><td>'
					+ arr[j].address + '</td></tr>');
				$info_tbody.append($tr);
			})(j);
		}
	}

	function resetModal() {
		$account_input.val('');
		$name_input.val('');
		$address_input.val('');
		$password_input.val('');
		$tip_wrapper.text('！');
		$tip_wrapper.css('display', 'none');
	}

	/*校验密码输入是否符合输入规则*/
	function checkNewpassword() {
		var value = $password_input.val();
		var result = isPasswd(value);
		console.log(value);
		console.log(result);
		if (value !== '') {
			if (!result) {
				$tip_wrapper.text('密码设置仅限数字，字母，下划线，特殊字符仅限 !#$%^&*');
				$tip_wrapper.css('display', 'block');
				return false;
			} else {
				$tip_wrapper.text('');
				$tip_wrapper.css('display', 'block');
				return true;
			}
		} else {
			$tip_wrapper.text('密码设置不能为空！');
			$tip_wrapper.css('display', 'block');
			return false;
		}
	}

	function isPasswd(s) {
		var patrn = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
		if (!patrn.exec(s)) return false;
		return true;
	}

	function submitWaterInfo() {
		var waterInfo = 'account=' + $account_input.val()
			+ '&passwd=' + $password_input.val()
			+ '&managerName=' + $name_input.val()
			+ '&managerAddress=' + $address_input.val();
		$.ajax({
			url: common_url + '/watersys/insertManagerInfo.do',
			type: 'POST',
			data: waterInfo,
			dataType: 'json',
			context: document.body,
			success: function (data) {
				if (data.msg === 0) {
					console.log('注册成功');
					$modal_wrapper.fadeOut('slow');
					resetModal();
				} else if (data.msg === 1) {
					console.log('数据库插入异常');
				} else if (data.msg === 2) {
					console.log('请求参数异常');
				} else if (data.msg === 3) {
					console.log('该账户已经注册');
				}
			},
			error: function () {
				console.log('网络错误！');
			}
		});

	}
});