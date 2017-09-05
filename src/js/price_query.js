$(function () {
	var $price_tbody = $('.price-tbody');
	var $nodata_tr = $('.nodata-tr');
	// var $btn_edit = $('.btn-edit');
	var $edit_td = $('.edit-td');
	var $select_factory_wrapper = $('.select-factory-wrapper');
	var $select_factory_input = $('.select-factory-input');
	var $add_btn = $('.add-btn');
	var $modal_wrapper = $('.modal-wrapper');
	var $close_icon = $('.close-icon');
	var $price_select = $('.price-select');
	var $submit_btn = $('.submit-btn');
	var $tip_wrapper = $('.tip-wrapper');
	var permission, factoryList;
	var priceType = {
		'4': '民用价格',
		'2': '商用价格',
		'3': '其他价格'
	}

	function PriceObj (option) {
		this.priceTypeName = option.priceTypeName;
		this.stepPriceInfoId = option.stepPriceInfoId;
		this.cycleTimes = option.cycleTimes;
		this.stepPriceOne = option.stepPriceOne;
		this.stepDosageOne = option.stepDosageOne;
		this.stepPriceTwo = option.stepPriceTwo;
		this.stepDosageTwo = option.stepDosageTwo;
		this.stepPriceThree = option.stepPriceThree;
		this.stepDosageThree = option.stepDosageThree;
		this.stepPriceFour = option.stepPriceFour;
	}

	PriceObj.prototype.getItem = function (ele) {
		return this[ele];
	};

	function fillTable (arr) {
		$nodata_tr.addClass('none');
		arr.map(function (obj) {
			var $tr = $('<tr>', {
				"data-id": obj.stepPriceInfoId
			});
			$tr.append($('<td>' + obj.priceTypeName + '</td>' +
				'<td class="canEdit-td">' + obj.cycleTimes + '</td>' +
				'<td class="canEdit-td">' + obj.stepPriceOne + '</td>' +
				'<td class="canEdit-td">' + obj.stepDosageOne + '</td>' +
				'<td class="canEdit-td">' + obj.stepPriceTwo + '</td>' +
				'<td class="canEdit-td">' + obj.stepDosageTwo + '</td>' +
				'<td class="canEdit-td">' + obj.stepPriceThree + '</td>' +
				'<td class="canEdit-td">' + obj.stepDosageThree + '</td>' +
				'<td class="canEdit-td">' + obj.stepPriceFour + '</td>'));
			var $btn_edit = $('<button>', {
				'data-id': obj.stepPriceInfoId,
				'data-state': 0,
				'class': 'btn btn-primary btn-edit',
				'text': '编辑'
			});
			$tr.append(($('<td>', {'class': 'editBtn-tr'})).append($btn_edit));
			$price_tbody.append($tr);
		});
	}

	/*渲染厂商列表*/
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
					renderTable('managerId=' + factoryList[0].managerId);
					initValueChange();
				} else {
					console.log('未查询到任何水务局信息');
					$.showSuccessPop({
						msg: '未查询到任何水务局信息',
						autoHide: true
					});
				}
			},
			error: function () {
				console.log('ajax error');
				$.showSuccessPop({
					msg: '网络错误，请重试！',
					type: 'failure',
					autoHide: true
				});
			}
		});
	}

	function initValueChange () {
		$select_factory_input.change(function () {
			console.log('changed');
			var data = 'managerUserId=' + $select_factory_input.val();
			console.log(data);
			renderTable(data);
		});

	}

	function getStorage (key) {
		var value = sessionStorage.getItem(key);
		return value ? value : false;
	}

	function initPage () {
		//1 电信 2 水务局
		// permission = getStorage('permission');
		permission = '1';
		console.log(permission);
		switch (permission) {
			case '1':
				/*初始化页面*/
				initFactoryList('');
				break;
			default:
				renderTable('');
				$select_factory_wrapper.css('display', 'none');
				break;
		}
	}

	function renderOption () {
		if ($price_select.has('option')) {
			$price_select.empty();
		}
		$price_select.append("<option value='4'>民用价格</option><option value='2'>商用价格</option><option value='3'>其他价格</option>")
	}

	function submitPrice () {
		var data = 'stepPriceInfoId=' + $price_select.val()
			+ '&cycleTimes=' + $('.cycleTimes-input').val()
			+ '&cycleTimes=' + $('.stepPriceOne-input').val()
			+ '&cycleTimes=' + $('.stepDosageOne-input').val()
			+ '&cycleTimes=' + $('.stepPriceTwo-input').val()
			+ '&cycleTimes=' + $('.stepDosageTwo-input').val()
			+ '&cycleTimes=' + $('.stepPriceThree-input').val()
			+ '&cycleTimes=' + $('.stepDosageThree-input').val()
			+ '&cycleTimes=' + $('.stepPriceFour-input').val();
		$.ajax({
			url: common_url + '/watersys/updateStepPriceInfo.do',
			type: 'POST',
			data: data,
			dataType: 'json',
			timeout: 5000,
			context: document.body,
			success: function (data) {
				console.log(data);
				if (data.msg === 0) {
					$('.price-input').each(function (index) {
						$(this).val('');
					});
					$modal_wrapper.css('display', 'none');
					$.showSuccessPop({
						msg: '操作成功！',
						type: 'success',
						autoHide: true
					});

				} else if (data.msg === 1) {
					console.log('数据库插入异常');
					$.showSuccessPop({
						msg: '数据库异常！',
						type: 'failure',
						autoHide: true
					});
				} else if (data.msg === 2) {
					console.log('请求参数为空');
					$.showSuccessPop({
						msg: '操作出错！',
						type: 'failure',
						autoHide: true
					});
				} else if (data.msg === 3) {
					console.log('该priceid有误');
					$.showSuccessPop({
						msg: '操作出错！',
						type: 'failure',
						autoHide: true
					});
				}
			},
			error: function () {
				console.log('网络异常！');
				$.showSuccessPop({
					msg: '网络错误，请重试！',
					type: 'failure',
					autoHide: true
				});
			}
		});
	}

	function addPrice (arr) {
		// if (arr.length < 3) {
		if (true) {
			$add_btn.removeClass('disabled none').click(function () {
				$modal_wrapper.css('display', 'block');
				renderOption();
				console.log(arr);
				arr.forEach(function (ele) {
					$price_select.find($('option[value=' + ele.stepPriceInfoId + ']')).remove();
				})
			});
			$submit_btn.click(function () {
				$tip_wrapper.addClass('none');
				$('.price-input').each(function (index) {
					if ($(this).val() === '') {
						$tip_wrapper.removeClass('none');
						return false;
					}
				});
				if ($tip_wrapper.hasClass('none')) {
					submitPrice();
				}
			});
			$close_icon.click(function () {
				$modal_wrapper.css('display', 'none');
			});
		} else {
			$add_btn.addClass('disabled none');
		}
	}


	function editPrice (sourceArr, id) {
		var $target_btn = $('button[data-id=' + id + ']');

		var $targetLine = $("tr[data-id=" + id + "]");
		var cycleTimes = $targetLine.find('td:eq(1)').text();
		var stepPriceOne = $targetLine.find('td:eq(2)').text();
		var stepDosageOne = $targetLine.find('td:eq(3)').text();
		var stepPriceTwo = $targetLine.find('td:eq(4)').text();
		var stepDosageTwo = $targetLine.find('td:eq(5)').text();
		var stepPriceThree = $targetLine.find('td:eq(6)').text();
		var stepDosageThree = $targetLine.find('td:eq(7)').text();
		var stepPriceFour = $targetLine.find('td:eq(8)').text();

		var changeV = function () {
			console.log(sourceArr);
			for (var i = 0; i < sourceArr.length; i++) {
				var element = sourceArr[i];
				if (element.stepPriceInfoId == id
					&& element.cycleTimes == cycleTimes
					&& element.stepPriceOne == stepPriceOne
					&& element.stepDosageOne == stepDosageOne
					&& element.stepPriceTwo == stepPriceTwo
					&& element.stepDosageTwo == stepDosageTwo
					&& element.stepPriceThree == stepPriceThree
					&& element.stepDosageThree == stepDosageThree
					&& element.stepPriceFour == stepPriceFour) {
					return false;//未做修改
				}
			}
			return true;
		}(sourceArr, id);

		if (changeV) {
			var data = 'stepPriceInfoId=' + id
				+ '&cycleTimes=' + cycleTimes
				+ '&stepPriceOne=' + stepPriceOne
				+ '&stepDosageOne=' + stepDosageOne
				+ '&stepPriceTwo=' + stepPriceTwo
				+ '&stepDosageTwo=' + stepDosageTwo
				+ '&stepPriceThree=' + stepPriceThree
				+ '&stepDosageThree=' + stepDosageThree
				+ '&stepPriceFour=' + stepPriceFour;
			console.log(data);
			$target_btn.text('更新中~')
			$.ajax({
				url: common_url + '/watersys/updateStepPriceInfo.do',
				type: 'POST',
				data: data,
				dataType: 'json',
				timeout: 5000,
				context: document.body,
				success: function (data) {
					console.log(data);
					if (data.msg === 0) {
						$target_btn.text('编辑').attr('data-state', '0').parent().parent().find('.canEdit-td').attr('contenteditable', false);
						$.showSuccessPop({
							msg: '修改成功！',
							type: 'success',
							autoHide: true
						});
					} else if (data.msg === 1) {
						$target_btn.text('编辑');
						console.log('数据库插入异常');
						$.showSuccessPop({
							msg: '数据库异常！',
							type: 'failure',
							autoHide: true
						});
					} else if (data.msg === 2) {
						$target_btn.text('编辑');
						console.log('请求参数为空');
						$.showSuccessPop({
							msg: '操作出错！',
							type: 'failure',
							autoHide: true
						});
					} else if (data.msg === 3) {
						$target_btn.text('编辑');
						console.log('该priceid有误');
						$.showSuccessPop({
							msg: '操作出错！',
							type: 'failure',
							autoHide: true
						});
					}
				},
				error: function () {
					$target_btn.text('编辑');
					console.log('网络异常！');
					$.showSuccessPop({
						msg: '网络错误，请重试！',
						type: 'failure',
						autoHide: true
					});
				}
			});
		} else {
			$target_btn.text('编辑').attr('data-state', '0').parent().parent().find('.canEdit-td').attr('contenteditable', false);
		}
	}

	function addEdit (arr) {
		$('.btn-edit').click(function (e) {
			var $btn_edit = $(e.target);
			var id = $btn_edit.attr('data-id');
			var state = $btn_edit.attr('data-state'); //0 按钮文本为编辑 1 按钮文本为完成
			console.log($btn_edit, id, state);
			switch (state) {
				case '0':
					var $canEdit_td = $btn_edit.parent().parent().find('.canEdit-td');
					$canEdit_td.attr("contenteditable", true);
					$canEdit_td[0].focus();
					$btn_edit.text('完成').attr('data-state', '1');
					break;
				default:
					editPrice(arr, id);
					break;
			}
		});
	}

	function renderTable (data) {
		$(".price-tbody tr:not(.nodata-tr)").remove();
		$.ajax({
			url: common_url + '/watersys/getStepPriceInfo.do',
			type: 'POST',
			data: data,
			dataType: 'json',
			timeout: 5000,
			context: document.body,
			success: function (data) {
				console.log(data);
				if (data.msg === 0) {
					/*渲染表格*/
					fillTable(data.dataList);
					addEdit(data.dataList);
					addPrice(data.dataList);
				} else {
					console.log('返回信息不存在');
					$.showSuccessPop({
						msg: '网络错误，请重试！',
						type: 'failure',
						autoHide: true
					});
					$nodata_tr.removeClass('none');
				}
			},
			error: function () {
				console.log('网络异常！');
				$.showSuccessPop({
					msg: '网络错误，请重试！',
					type: 'failure',
					autoHide: true
				});
				$nodata_tr.removeClass('none');
			}
		});
	}

	/*初始化页面，区分电信和水务局*/
	initPage();

});