jQuery(document).ready(function($) {

	var thingful = new Thingful(); // simple thingful object
	var bikeResult = null;  // variable to store the thingful response for bicycle
	var airQualityResult = null; // variable to store the thingful response for air quality
	var weatherResult = null; // variable to store the thingful response for weather
	var lat, lon;
	var errors;

	// Make GET requests to the Thingful API.
	// In this case there will be 3 separate requests. 
	// One for bicycle availability, one for air quality data and one for weather data
	function getData(position){

		lat = position.coords.latitude;
		lon = position.coords.longitude;

		var logs = "Requesting bike data near you<br>";
		//we only limit radius for 500m and only ask for 5 things
		thingful.get("q=bike&geo-lat=" + lat + "&geo-long=" + lon + "&geo-radius=500&sort=distance&limit=5", function(data){
			bikeResult = data;
			allDataReceived();
		});

		logs += "Requesting air quality data near you<br>";
		thingful.get("q=airquality&geo-lat=" + lat + "&geo-long=" + lon + "&geo-radius=500&sort=distance&limit=5", function(data){
			airQualityResult = data;
			allDataReceived();
		});

		logs += "Requesting weather data near you<br><br>";
		thingful.get("q=weather&geo-lat="+ lat + "&geo-long=" + lon + "&geo-radius=500&sort=distance&limit=5", function(data){
			weatherResult = data;
			allDataReceived();
		});

		logs += "Waiting for responses...";
		$("#content").find(".logs").append("<p>" + logs + "</p>");
		$("#content").find(".logs").append("<img id='loading-wheel' src='https://thingful.github.io/bike-today/images/loading-wheel.svg' />");

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
	// Note that it is possible that Thingful returns data unrelated to what we are interested in. 
	// So it is recommended to always check channel's id before using it's value.
	function processValue() {
		$('#loading-wheel ').fadeOut('fast');

		var response = "";
		var summary = "<h3>SUMMARY</h3>";
		var bikeAvailable, airQuality, temperature, tempUnit;

		// ensure data array is defined and extract data
		bikeAvailable = 0;
		if (bikeResult.data != undefined) {
			for (i = 0; i < bikeResult.data[0].attributes.channels.length; i++) { 
				//check channel's id before using it's value.
				if(isBikeAvailableChannel( bikeResult.data[0].attributes.channels[i].id )){
					bikeAvailable = bikeResult.data[0].attributes.channels[i].value;
				}
			}
			
		}

		airQuality = 0;
		if ( airQualityResult.data != undefined) {
			for (i = 0; i < airQualityResult.data[0].attributes.channels.length; i++) { 
				//check channel's id before using it's value.
				if(isAirQualityChannel( airQualityResult.data[0].attributes.channels[i].id )){
					airQuality = airQualityResult.data[0].attributes.channels[i].value;
				}
			}
		}

		temperature = 0;
		if (weatherResult.data != undefined) {
			for (i = 0; i < weatherResult.data[0].attributes.channels.length; i++) { 
				//check channel's id before using it's value.
				if(isTemperatureChannel( weatherResult.data[0].attributes.channels[i].id )){
					temperature = weatherResult.data[0].attributes.channels[i].value;
					tempUnit = weatherResult.data[0].attributes.channels[i].units;
				}
			}
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
			summary += "<p>Air quality is bad: " + airQuality +"</p>";
		} else {
			summary += "<p>Air quality is good: " + airQuality +"</p>";
		}

		// our arbitary threshold for temperature
		if (temperature < 10) { 
			bikeToday = false;
			if(tempUnit != null){
				summary += "<p>But it's too cold: "+ temperature + " " + tempUnit + "</p>";
			}else{
				summary += "<p>But it's too cold: "+ temperature + "</p>";
			}
		} else {
			if(tempUnit != null){
				summary += "<p>Temperature is nice: " + temperature + " " + tempUnit + "</p>";
			}else{
				summary += "<p>Temperature is nice: " + temperature + "</p>";
			}
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

	//when button is pressed, get geolocation then query the Thingful API
	$('button').on('click', function() {
		
		$(this).hide();

		$( "#content" ).append( '<div class="logs"><p>Getting geolocation...</p></div>' );

		getLocation(getData);
	});

	// close dialog box
	$('body').on('click', 'div#close', function() {
		$('#overlay').remove();
	});

	function isBikeAvailableChannel(channelID){
		var possibleBikeChannelIDs = ["bike", "bikes", "availability", "available"];
		for (j = 0; j < possibleBikeChannelIDs.length; j++) { 
			if(channelID.toUpperCase() == possibleBikeChannelIDs[j].toUpperCase()){
				return true;
			}
		}
		return false;
	}

	function isAirQualityChannel(channelID){
		var possibleAirQualityChannelIDs = ["airquality", "airqualityindex", "air quality", "air quality index"];
		for (j = 0; j < possibleAirQualityChannelIDs.length; j++) { 
			if(channelID.toUpperCase() == possibleAirQualityChannelIDs[j].toUpperCase()){
				return true;
			}
		}
		return false;
	}

	function isTemperatureChannel(channelID){
		var possibleTemperatureChannelIDs = ["temp", "temperature"];
		for (j = 0; j < possibleTemperatureChannelIDs.length; j++) { 
			if(channelID.toUpperCase() == possibleTemperatureChannelIDs[j].toUpperCase()){
				return true;
			}
		}
		return false;
	}



});