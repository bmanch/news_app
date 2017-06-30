$(document).ready(function() {
	$('.noter').on('click', function(event) {
		event.preventDefault();
		var id = $(this).attr('data-modal');

		var queryUrl = "/getnotes/" + id.substring(6);

		$.get(queryUrl, function(data) {
			console.log(data);
			$('#allNotes' + id.substring(6)).empty();
			for (var i = 0; i < data.notes.length; i++) {
				var li = $('<li>');
				var divOne = $('<div>');
				var divTwo = $('<div>');
				var divThree = $('<div>');
				var deleteButton = $('<a>');

				divOne.addClass('collapsible-header').text("Note from " + data.notes[i].name);
				divTwo.addClass('collapsible-body').html('<span>' + data.notes[i].body + '</span>');
				divThree.addClass('noteId').attr('id', data.notes[i]._id).css('display', 'none');
				
				li.append(divOne).append(divTwo).append(divThree).append(deleteButton);
				$('#allNotes' + id.substring(6)).append(li);
			}
			$(id).modal('open');
		});
	});

	$('.delete').on('click', function(event) {
		event.preventDefault();
		
		var queryUrl = "/delete/" + $(this).parent().children('span').first().text();
		var pageAmend = $(this).parent();

		$.ajax({
			url: queryUrl,
			method: "DELETE"
		}).done(function(response) {
			pageAmend.addClass('red');
			pageAmend.html("<h4>Article deleted.</h4>");
		});
	});

	$('.note-text').on('click', function(event) {
		event.preventDefault();
		$('#close').click();
		Materialize.toast("Note saved!", 4000);

		var queryUrl = "/addnote/" + $(this).attr('id');
		var name = $('#userName').val().trim();
		var body = $('#textarea').val().trim();

		if (name === "") {
			name = "Anonymous";
		}

		if (body === "") {
			return alert("You must include a note");
		}

		var noteObject = {
			name: name,
			body: body
		}

		$.post(queryUrl, noteObject, function(data) {
			$('#userName').val("");
			$('#textarea').val("");
			$('#close').click();
			Materialize.toast("Note saved!", 4000);
		});
	});
});