$(document).ready(function() {
	$(".button-collapse").sideNav();
	
	$('.noter').on('click', function(event) {
		event.preventDefault();
		var id = $(this).attr('data-modal');

		var queryUrl = "/getnotes/" + id.substring(6);

		$.get(queryUrl, function(data) {
			console.log(data);
			$('#allNotes' + id.substring(6)).empty();
			if (data.notes.length === 0) {
				$('.no-notes').text("There are no notes yet on this article.");
			} else {
				$('.no-notes').empty();
				for (var i = 0; i < data.notes.length; i++) {
					var li = $('<li>');
					var divOne = $('<div>');
					var divTwo = $('<div>');
					var divThree = $('<div>');

					divOne.addClass('collapsible-header').text("Note from " + data.notes[i].name);
					divTwo.addClass('collapsible-body').html('<span>' + data.notes[i].body + '</span><hr><a class="deleteNote btn-floating btn-small waves-effect waves-light red"><i class="material-icons">delete</i></a>');
					divThree.addClass('noteId').attr('id', data.notes[i]._id).css('display', 'none');
					
					li.append(divOne).append(divTwo).append(divThree);
					$('#allNotes' + id.substring(6)).append(li);
				}
			}
			$(id).modal('open');

			$('.deleteNote').on('click', function(event) {
				event.preventDefault();

				var noteId = $(this).parent().next().attr('id');

				var queryUrl = "/deletenote/" + noteId;

				$.ajax({
					url: queryUrl,
					method: "DELETE"
				}).done(function(response) {
					Materialize.toast(response, 4000);
					$('.close').click();
				});
			});
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
			pageAmend.html("<h5>Article deleted.</h5>");
		});
	});

	$('.note-text').on('click', function(event) {
		event.preventDefault();

		var queryUrl = "/addnote/" + $(this).attr('id');
		var name = $(this).parent().prev().prev().find('input').val().trim();
		var body = $(this).parent().prev().find('textarea').val().trim();
		console.log(name);
		console.log(body);

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
			$('.user-name').val("");
			$('.user-note').val("");
			$('.close').click();
			Materialize.toast("Note saved!", 4000);
		});
	});
});