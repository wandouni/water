$(function () {
	var $change_password_item = $('.change-password-item');
	var $add_plant_item = $('.add-plant-item');

	var currentPermission = sessionStorage.getItem('permission');
	if (currentPermission === '1') {
		$change_password_item.css('display', 'none');
		$add_plant_item.css('display', 'block');
		console.log('nav.js');
	} else {
		$change_password_item.css('display', 'block');
		$add_plant_item.css('display', 'none');
	}
});