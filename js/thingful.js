class Thingful{

	constructor() {
		
	}

	setKey(apiKey){
		this.apiKey = apiKey;
		console.log("new key = " + this.apiKey);
	}
	
	get( something, callback ) {
	var query = "http://api.thingful.net/things?" + something;
	console.log("getting:  " + query);
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