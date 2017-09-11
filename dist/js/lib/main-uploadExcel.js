;
require.config({
	paths: {
		'jquery': 'jquery-3.1.1.min',
		'uploadExcel': '../../../src/js/upload_excel'
	}
});
require(['jquery'], function ($) {
	require(['uploadExcel']);
});