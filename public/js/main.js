$(document).ready( function() {
	$('.stats.templates ul.replies').click(function() {
		var $el = $(this);
		$el.toggleClass('expanded');
	});
});