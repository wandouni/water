$(function () {
	var $change_password_item = $('.change-password-item');
	var $add_plant_item = $('.add-plant-item');
	var $upload_excel_item = $('.upload-excel-item');

	var currentPermission = sessionStorage.getItem('permission');
	if (currentPermission === '1') {
		$change_password_item.css('display', 'none');
		$add_plant_item.css('display', 'block');
		$upload_excel_item.css('display', 'block');
		console.log('nav.js');
	} else {
		$change_password_item.css('display', 'block');
		$add_plant_item.css('display', 'none');
		$upload_excel_item.css('display', 'none');
	}


	/*用户名称显示*/
	var $user = $('.user'), permission;
	initPage();
	function initPage () {
		var managerName = getStorage('managerName');
		if (managerName) {
			$user.text('用户：' + managerName);
		} else {
			$user.text('用户：' + '---');
		}
	}

	function getStorage (key) {
		var value = sessionStorage.getItem(key);
		return value ? value : false;
	}
});