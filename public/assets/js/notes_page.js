$(document).ready(function() {
	console.log("here");
	$('.noter').on('click', function(event) {
		event.preventDefault();
		var id = $(this).attr('data-modal');
		console.log(id);
		$(id).modal('open');
	});

	$('.delete').on('click', function(event) {
		event.preventDefault();
		console.log($(this).parent().children('span').first().text());
		var queryUrl = "/delete/" + $(this).parent().children('span').first().text();

		$.ajax({
			url: queryUrl,
			method: "DELETE"
		}).done(function(response) {
			Materialize.toast(response, 4000);
			$(this).parent().children('a').first().empty();
		});
	});
});