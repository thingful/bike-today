// simple thingful class to handle sending GET request
// more features will be added in the future

var Thingful = function(){
	
	this.get = function( parameters, callback ) {
		var query = "https://api.thingful.net/things?" + parameters;
		console.log("getting: " + parameters);
		
		// make request to Thingful API
		var jqxhr = $.getJSON( query, function(data) {
			callback(data);
		})
		.fail(function() {
			console.log( "error" );
		});
	}
}