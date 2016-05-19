class Thingful{
	
	get( something, callback ) {
	var query = "http://api.thingful.net/things?" + something;
	console.log("getting:  " + query);
	
	// mske request to thingful
	var jqxhr = $.get( query, function(data) {
		// console.log( "success" );
	})
		.done(function(data) {
			callback(data);
			// console.log(data);
			console.log( "success" );
		})

		.fail(function() {
			console.log( "error" );
		})

		.always(function() {
			// console.log( "finished" );
		});

    }

}