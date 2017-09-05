$(function () {
	var $checkbox_wrapper = $('.checkbox-wrapper'),
		$checkbox_checked = $('.checkbox-checked'),
		$remember_text = $('.remember-text'),
		$user_input = $('.user-input'),
		$user_icon = $('.user-icon'),
		$password_input = $('.password-input'),
		$password_icon = $('.password-icon'),
		$user_close = $('.user-close'),
		$password_close = $('.password-close'),
		$sign_in = $('.sign-in'),
		$prompt = $('.prompt');

	$checkbox_wrapper.click(function () {
		if ($checkbox_checked.hasClass('none')) {
			$checkbox_checked.removeClass('none');
			$remember_text.css('color', '#527ee6');
			if ($user_input.val() !== null) {
				sessionStorage.setItem('username', $user_input.val());
			}
		} else {
			$checkbox_checked.addClass('none');
			$remember_text.css('color', '#a8a8a8');
			sessionStorage.removeItem('username');
		}
	});

	$user_input.focus(function () {
		$user_icon.css('color', '#529fff');
	});
	$user_input.blur(function () {
		$user_icon.css('color', '#d1d1d1');
	});
	$user_input.bind('input propertychange', function () {
		if ($('.user-input').val() !== '') {
			$user_close.css('display', 'block');
		} else {
			$user_close.css('display', 'none');
		}
	});

	$password_input.focus(function () {
		$password_icon.css('color', '#529fff');
	});
	$password_input.blur(function () {
		$password_icon.css('color', '#d1d1d1');
	});
	$password_input.bind('input propertychange', function () {
		if ($('.password-input').val() !== '') {
			$password_close.css('display', 'block');
		} else {
			$password_close.css('display', 'none');
		}
	});

	$user_close.click(function () {
		$user_input.val('');
		$user_input.focus();
		$user_close.css('display', 'none');
	});
	$password_close.click(function () {
		$password_input.val('');
		$password_input.focus();
		$password_close.css('display', 'none');
	});

	getUser();
	/*获取sessionStorage*/
	function getUser() {
		var user = sessionStorage.getItem('username');
		console.log(user);
		if (user) {
			$user_input.val(user);
			console.log('111');
			$checkbox_checked.removeClass('none');
			$remember_text.css('color', '#527ee6');
		}
	}

	/*------------------登陆按钮点击事件------------------*/
	$sign_in.click(function () {
		var access = $user_input.val();
		var password = $password_input.val();
		if (access === '' || password === '') {
			showError('block', '账号和密码不能为空');
		} else {
			login(access, password);
		}
	});

	/*显示登录可能出现的错误*/
	function showError(state, text) {
		$prompt.css('display', state);
		$prompt.text(text);
	}

	/*登录函数，ajax函数*/
	function login(a, p) {
		var data = 'access=' + a + '&' + 'password=' + p;
		console.log(data);
		$.ajax({
			type: 'POST',
			url: common_url + '/watersys/confirmLogin.do',
			dataType: 'json',
			context: document.body,
			data: data,
			timeout: 5000,
			success: function (data) {
				var msg = data.msg;
				var permission = data.permission;
				var managerName = data.managerName;
				switch (msg) {
					/*1.msg为2，传递参数出错*/
					case 2:
						showError('block', '登录出错！');
						break;

					/*2.msg为4，输入账号不存在*/
					case 4:
						showError('block', '输入账号不存在');
						break;

					/*3.msg为5，输入密码出错*/
					case 5:
						showError('block', '输入密码出错');
						break;

					/*4.msg为0，成功*/
					default:
						$user_input.val('');
						sessionStorage.setItem('permission', permission);
						sessionStorage.setItem('managerName', managerName);
						window.location.href = '../manager/index.html';
						break;
				}
			},
			error: function (XMLHttpRequest, textStatus) {
				console.log('ajax error');
				alert('网络错误');
			}
		});
	}

});