(function($) {

	var	$window = $(window),
		$body = $('body');

		$window.on('load', function() {
			const loadingScreen = $('#loading-screen');

			window.setTimeout(function() {
				$body.removeClass('is-preload');
				loadingScreen.addClass('hidden');

				loadingScreen.one('transitionend', function() {
					loadingScreen.css('display', 'none');
				});
			}, 100);
		});

})(jQuery);