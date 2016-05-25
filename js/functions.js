jQuery(document).ready(function($) {

	var thingful = new Thingful(); // simple thingful object
	var bikeResult = null; 
	var airQualityResult = null;
	var weatherResult = null;
	var lat, lon;
	var errors;

	// Make GET requests to the Thingful API.
	// In this case there will be 3 separate requests. 
	// One for bicycle availability, one for air quality data and one for weather data
	function getData(position){

		lat = position.coords.latitude;
		lon = position.coords.longitude;

		var logs = "Requesting bike data near you<br>";
		thingful.get("q=bike&lat=" + lat + "&long=" + lon + "&radius=500&sort=distance&limit=5", function(data){
			bikeResult = data;
			allDataReceived();
		});

		logs += "Requesting air quality data near you<br>";
		thingful.get("q=airquality&lat=" + lat + "&long=" + lon + "&radius=500&sort=distance&limit=5", function(data){
			airQualityResult = data;
			allDataReceived();
		});

		logs += "Requesting weather data near you<br><br>";
		thingful.get("q=weather&lat="+ lat + "&long=" + lon + "radius=500&sort=distance&limit=5", function(data){
			weatherResult = data;
			allDataReceived();
		});

		logs += "Waiting for responses...";
		$("#content").find(".logs").append("<p>" + logs + "</p>");
		$("#content").find(".logs").append("<img id='loading-wheel' src='/images/loading-wheel.svg' />");

		// show loading wheel
		$('#loading-wheel ').fadeIn('slow');
	}

	// Ensure all the necessary data is available before processing the data
	// This function is called everytime we received data
	function allDataReceived(){

		if (bikeResult && airQualityResult && weatherResult) {

			console.log("All responses received");
			console.log(bikeResult);
			console.log(airQualityResult);
			console.log(weatherResult);
			
			processValue(); 
		}
	}

	// Find the values that we want to process.
	// because the result is sorted by distance, we just pick the first one. 
	// Note that it is possible that Thingful returns cycling data unrelated
	// to availability (which is what we are interested in). 
	// It is recommended to always check channel's id before using it's value.
	function processValue() {
		$('#loading-wheel ').fadeOut('fast');

		var response = "";
		var summary = "<h3>SUMMARY</h3>";

		// ensure data array is defined and extract data
		if (bikeResult.data != undefined) {
			var bikeAvailable = bikeResult.data[0].attributes.channels[0].value;
		} else {
			bikeAvailable = 0;
		}

		if ( airQualityResult.data != undefined) {
			var airQuality = airQualityResult.data[0].attributes.channels[0].value;
		} else {
			airQuality = 0;
		}

		if (weatherResult.data != undefined) {
			var temperature = weatherResult.data[0].attributes.channels[0].value;
			var tempUnit = weatherResult.data[0].attributes.channels[0].units;
		} else {
			temperature = 0;
		}

		// process the values returned from Thingful using a very simple logic
		var bikeToday = true; // this is the answer, with default value to true

		if (bikeAvailable == 0){ 
			summary += "<p>There is no bike for you</p>";
			bikeToday = false; // return false if conditions are not met
		} else {
			summary += "<p>There are " + bikeAvailable + " available bikes for you<p/>";
		}

		// our arbitary threshold for air quality index
		if (airQuality < 50) { 
			bikeToday = false;
			summary += "<p>Air quality is bad</p>";
		} else {
			summary += "<p>Air quality is good: "+ airQuality +"</p>";
		}

		// our arbitary threshold for temperature
		if (temperature < 10) { 
			bikeToday = false;
			summary += "<p>But it's too cold: "+ temperature + " " + tempUnit + "</p>";
		} else {
			summary += "<p>Temperature is nice: " + temperature + " " + tempUnit + "</p>";
		}

		// display summary
		$( "#content" ).append( '<div id="summary">' + summary + '</div>' );

		// finally display the result
		if (bikeToday) { 
			response += "<div id='reponse-ok'><h2>It's a good day to cycle!</h2></div>";
		} else {
			response += "<div id='reponse-bad'><h2>It's not a good day to cycle</h2></div>";
		}

		// display response
		$( "#content" ).append( '<div id="response">' + response + '</div>' );
	}

	// get geolocation and query the Thingful API
	$('button').on('click', function() {
		
		$(this).hide();

		$( "#content" ).append( '<div class="logs"><p>Getting geolocation...</p></div>' );

		getLocation(getData);
	});

	// close dialog box
	$('body').on('click', 'div#close', function() {
		$('#overlay').remove();
	});

});