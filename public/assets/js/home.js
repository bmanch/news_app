$(document).ready(function() {
	$('.saver').on('click', function(event) {
		event.preventDefault();

		$(this).html('<i class="material-icons">turned_in</i>');
		console.log($(this).parent().children('span').first().text());
		var queryUrl = "/save/" + $(this).parent().children('span').first().text();
		console.log(queryUrl);

		$.ajax({
			url: queryUrl,
			method: "PUT"
		}).done(function(response) {
			Materialize.toast(response, 4000);
		});
	});
});