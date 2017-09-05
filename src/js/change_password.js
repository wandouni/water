$(function () {
	var $old_password = $('.old-password');//旧密码输入框
	var $new_password = $('.new-password');//新密码输入框
	var $confirm_password = $('.confirm-password');//新密码输入确认
	var $confirm_btn = $('.confirm-btn');//确定按钮

	var $new_password_tip = $('.new-password-tip');//新密码提示
	var $confirm_password_tip = $('.confirm-password-tip');//确认密码提示

	var old_password_flag = false;
	var new_password_flag = false;
	var confirm_password_flag = false;

	var confirm_btn_statue = false;

	$old_password.blur(function () {
		var value = $old_password.val();
		if (value !== '') {
			old_password_flag = !old_password_flag;
		}
		canClick();
	});

	$new_password.bind('input propertychange', checkNewpassword);

	$new_password.blur(function () {
		if (checkNewpassword()) {
			new_password_flag = !new_password_flag;
			$new_password_tip.css('display', 'block');
			$new_password_tip.text('验证通过！');
		}
		canClick();
	});

	$confirm_password.bind('input propertychange', function () {
		var new_password = $new_password.val();
		var confirm_new_password = $confirm_password.val();
		if (new_password === confirm_new_password) {
			$confirm_password_tip.text('验证通过！');
			$confirm_password_tip.css('display', 'block');
			confirm_password_flag = true;
		}
		canClick();
	});

	$confirm_password.blur(function () {
		checkConfirm();
		canClick();
	});

	$confirm_btn.click(function () {
		if (canClick()) {
			var data = 'oldPasswd=' + $old_password.val() + '&newPasswd=' + $new_password.val();
			console.log(data);
			$.ajax({
				type: 'POST',
				url: common_url + '/watersys/updateManagerPasswd.do',
				dataType: 'json',
				context: document.body,
				data: data,
				timeout: 5000,
				success: function (data) {
					if (data.msg === '0') {
						console.log('修改成功！');
						// alert('修改成功！');
						$.showSuccessPop({
							msg: '修改成功',
							type: 'failure',
							autoHide: true
						});
					} else if (data.msg === '1') {
						// alert('数据库修改失败请重试！');
						$.showSuccessPop({
							msg: '数据库修改失败请重试',
							type: 'failure',
							autoHide: true
						});
						console.log('数据库修改失败请重试！');
					} else {
						// alert('旧密码输入错误！');
						$.showSuccessPop({
							msg: '旧密码输入错误！',
							type: 'failure',
							autoHide: true
						});
					}
				},
				error: function () {
					console.log('ajax error');
					// alert("网络出错");
					$.showSuccessPop({
						msg: '网络错误，请重试！',
						type: 'failure',
						autoHide: true
					});
				}
			});
		}
	});

	//当三个输入框都校验通过时，按钮可以点击
	function canClick() {
		if (old_password_flag && new_password_flag && confirm_password_flag) {
			$confirm_btn.removeClass('gray');
			$confirm_btn.addClass('blue');
			confirm_btn_statue = !confirm_btn_statue;
			return true;
		}
	}

	/*校验新密码是否符合输入规则*/
	function checkNewpassword() {
		var value = $new_password.val();
		var result = isPasswd(value);
		console.log(value);
		console.log(result);
		if (value !== '') {
			if (!result) {
				$new_password_tip.text('密码设置仅限数字，字母，下划线，特殊字符仅限 !#$%^&*');
				$new_password_tip.css('display', 'block');
				return false;
			} else {
				$new_password_tip.text('');
				$new_password_tip.css('display', 'block');
				return true;
			}
		} else {
			$new_password_tip.text('密码设置不能为空！');
			$new_password_tip.css('display', 'block');
			return false;
		}
	}

	function checkConfirm() {
		var new_password = $new_password.val();
		var confirm_new_password = $confirm_password.val();
		if (confirm_new_password !== '' && new_password !== '') {
			if (new_password !== confirm_new_password) {
				$confirm_password_tip.text('两次密码输入不一致！');
				$confirm_password_tip.css('display', 'block');
			} else {
				$confirm_password_tip.text('验证通过！');
				$confirm_password_tip.css('display', 'block');
				confirm_password_flag = true;
			}
		} else {
			$confirm_password_tip.text('密码设置不能为空');
			$confirm_password_tip.css('display', 'block');
		}

	}

	function isPasswd(s) {
		var patrn = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
		if (!patrn.exec(s)) return false;
		return true;
	}

});