/**
 * Created by admin on 2017/9/7.
 */
$(function () {
	var $select_factory_wrapper = $('.select-factory-wrapper'),
		$select_factory_input = $('.select-factory-input'),
		factoryList,
		$upload = $('.upload'),
		$upload_label = $('.upload-label'),
		$get_standardfile = $('.get-standard-file'),
		$submit_btn = $('.submit-btn'),
		$upload_file_form = $('.upload-file-form');

	function getStorage (key) {
		var value = sessionStorage.getItem(key);
		return value ? value : false;
	}

	function renderFactoryList (factoryList) {
		for (var i = 0; i < factoryList.length; i++) {
			$select_factory_input.append($('<option>', {
				value: factoryList[i].managerId,
				text: factoryList[i].managerName
			}));
		}
		console.log($select_factory_input.val());
	}

	function initFactoryList (data) {
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

	function checkFile () {
		$upload_file_form.ajaxSubmit({
			url: common_url + '/watersys/saveExcelFile.do',
			type: "post",
			enctype: 'multipart/form-data',
			dataType: 'json',
			success: function (data) {
				console.log(data);
				/*				$.showSuccessPop({
				 msg: '上传成功！',
				 type: 'success',
				 autoHide: true
				 });*/
			},
			error: function (data) {
				console.log(data);
				$.showSuccessPop({
					msg: '网络错误，请重试！',
					type: 'failure',
					autoHide: true
				});
			}
		});
		return false;
	}

	function initPage () {
		/*1.获取session,判断是哪个角色*/
		var permission = getStorage('permission');
		console.log(permission);
		permission = '1';
		if (permission === false) {
			//重定向至首页
			// window.location.href = '../../manager/index.html';
		} else {
			$select_factory_wrapper.css('display', 'block');
			initFactoryList('');
			$upload.change(function (e) {
				var pathArr = $(this).val().split('\\');
				$upload_label.text(pathArr[pathArr.length - 1]);
			});
			$get_standardfile.attr('href', common_url + '/watersys/templatExcel.do');
			$submit_btn.click(checkFile);
		}
	}

	initPage();

});