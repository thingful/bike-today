var Thingful = function(){
	
	this.query = function( parameters, callback ) {
		var query = "http://api.thingful.net/things?" + parameters;
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