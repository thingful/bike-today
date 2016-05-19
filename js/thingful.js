var Thingful = function(){
	
	this.get = function( parameters, callback ) {
		var query = "https://api.thingful.net/things?" + parameters;
		console.log("getting: " + parameters);
		
		// mske request to thingful
		var jqxhr = $.get( query, function(data) {
			callback(data);
		})
		.fail(function() {
			console.log( "error" );
		});
	}
}