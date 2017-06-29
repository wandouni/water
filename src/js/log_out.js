$(function () {
	var $Cancellation = $('.Cancellation');
	$Cancellation.click(function () {
		logOut();
	});
	function logOut() {
		$.ajax({
			url: common_url + '/watersys/loginOut.do',
			data: '',
			dataType: 'json',
			context: document.body,
			timeout: 5000,
			success: function (data) {
				window.location.href = '../../login.html';
			},
			error: function () {
				console.log('ajax error');
				alert('登出失败！');
			}
		});
	}
});