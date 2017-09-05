;(function ($) {
	//1.成功 success，2.失败 failure，3.update 查询中，注册中，更新中,显示文字自动消失 4.问题提示 text
	$.extend({
		showSuccessPop: function (options) {
			var _default = {
				speed: 500,  //淡入淡出速度
				bgcolor: '#fff',  //背景颜色
				type: 'text',    //弹窗类型
				msg: '这是一条测试文字！',  //默认提示文字
				autoHide: false,         //是否自动隐藏
				hideTime: 3000,          //延时多少秒消失
				callback: function () {   //默认回调函数
				}
			};
			var opts = $.extend({}, _default, options);

			(function () {
				createdPop();
			})();

			function createdPop() {
				var $popWrapper, $centerWrapper, $loadingAnimation, $msgWrapper;
				switch (opts.type) {
					case 'success':
						$popWrapper = $('<div>', {
							class: 'successWrapper popWrapper'
						});
						$centerWrapper = $('<div>', {
							class: 'center-wrapper'
						});
						$loadingAnimation = $('<div>', {
							class: 'success-img-wrapper'
						});
						$msgWrapper = $('<div>', {
							class: 'msg-wrapper',
							text: opts.msg
						});
						$centerWrapper.append($loadingAnimation);
						$centerWrapper.append($msgWrapper);
						$popWrapper.append($centerWrapper);
						break;
					case 'failure':
						$popWrapper = $('<div>', {
							class: 'failureWrapper popWrapper'
						});
						$centerWrapper = $('<div>', {
							class: 'center-wrapper'
						});
						$loadingAnimation = $('<div>', {
							class: 'failure-img-wrapper'
						});
						$msgWrapper = $('<div>', {
							class: 'msg-wrapper',
							text: opts.msg
						});
						$centerWrapper.append($loadingAnimation);
						$centerWrapper.append($msgWrapper);
						$popWrapper.append($centerWrapper);
						break;
					case 'updating':
						$popWrapper = $('<div>', {
							class: 'updatingWrapper popWrapper'
						});
						$centerWrapper = $('<div>', {
							class: 'center-wrapper'
						});
						$loadingAnimation = $('<div>', {
							class: 'loading-animation-wrapper'
						});
						$msgWrapper = $('<div>', {
							class: 'msg-wrapper',
							text: opts.msg
						});
						$centerWrapper.append($loadingAnimation);
						$centerWrapper.append($msgWrapper);
						$popWrapper.append($centerWrapper);
						break;
					default:
						$popWrapper = $('<div>', {
							class: 'textWrapper popWrapper',
							text: opts.msg
						});
						break;
				}
				$('body').append($popWrapper);
				if (opts.autoHide) {
					setTimeout(function () {
						closePop(opts.callback);
					}, opts.hideTime)
				}
			}

			function closePop(callback) {
				var $popWrapper = $('.popWrapper');
				$popWrapper.fadeOut(opts.speed, function () {
					$popWrapper.remove();
				});
				if (typeof callback === 'function') {
					callback();
				}
			}
		}
	});
})(window.jQuery);