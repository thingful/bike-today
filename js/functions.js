
"use strict";

jQuery(document).ready(function($) {
	var thingful = new Thingful();
	var bikeResult = null;
	var airQualityResult = null;
	var weatherResult = null;
	var lat, lon;
	var content = $('#content');
	var report = ""; // the final output that will be displayed

	// Find user geolocation
	function getLocation() {

		$('button').remove();

	    if (navigator.geolocation) {
	    	report += "Getting geolocation..."
	    	console.log("Getting geolocation...");
	    	// call getData once received geolocation
	        navigator.geolocation.getCurrentPosition(getData, showError);


	    } else { 
	    	report += "Geolocation is not supported by this browser..."
	    	console.log("Geolocation is not supported by this browser.");
	    }

	    content.html(report);
	}


	//error handling for location checking
	function showError(error) {
	    switch(error.code) {
	        case error.PERMISSION_DENIED:
	        	content.html("User denied the request for Geolocation.");
	            console.log("User denied the request for Geolocation.");
	            break;
	        case error.POSITION_UNAVAILABLE:
	        	content.html("Location information is unavailable.");
	            console.log("Location information is unavailable.");
	            break;
	        case error.TIMEOUT:
	        	content.html("The request to get user location timed out.");
	            console.log("The request to get user location timed out.");
	            break;
	        case error.UNKNOWN_ERROR:
	        	content.html("An unknown error occurred.");
	            console.log("An unknown error occurred.");
	            break;
	    }
	}


	// Make GET requests to the Thingful API.
	// In this case there will be 3 separate requests. One for bicycle
	// availability, one for air quality data and one for weather data
	function getData(position){

		lat = position.coords.latitude;
	    lon = position.coords.longitude;

	    report += "done<br><br>"
	    content.html(report);

	    
		report += "Requesting for bike <br>"
		thingful.get('q=bike&lat='+lat+'long='+lon+'radius=500&sort=distance&limit=5', function(data){
			bikeResult = data;
			allDataReceived();
		});

		report += "Requesting for air quality <br>"
		thingful.get('q=airquality&lat='+lat+'long='+lon+'radius=500&sort=distance&limit=5', function(data){
			airQualityResult = data;
			allDataReceived();
		});

		report += "Requesting for weather <br><br>"
		thingful.get('q=weather&lat='+lat+'long='+lon+'radius=500&sort=distance&limit=5', function(data){
			weatherResult = data;
			allDataReceived();
		});

		report += "Waiting for responses...<br>";
		content.html(report);
	}

	// Ensure all the necessary data is available before processing the data
	function allDataReceived(){
		if (bikeResult && airQualityResult && weatherResult) {
			report += "All responses received <br><br>"
			content.html(report);

			console.log("All responses received");
			console.log(bikeResult);
			console.log(airQualityResult);
			console.log(weatherResult);

			content.html(report);
			processValue();
		} else {
			return;
		}

	}

	// Find the values that we want to process.
	// because the result is sorted by distance, we just pick the first one. 
	// Note that it is possible that Thingful returns cycling data unrelated
	// to availability (which is what we are interested in). 
	// It is recommended to always check values before using them.
	function processValue(){
		var bikeID = bikeResult.data[0].attributes.channels[0].id;
		var bikeAvailable = bikeResult.data[0].attributes.channels[0].value;

		var airQualityID = airQualityResult.data[0].attributes.channels[0].id;
		var airQuality = airQualityResult.data[0].attributes.channels[0].value;

		var temperatureID = weatherResult.data[0].attributes.channels[3].id;
		var temperature = weatherResult.data[0].attributes.channels[3].value;


		// process the values returned from Thingful using a very simple logic
		var bikeToday = true; // this is the answer, with default value to true

		if (bikeAvailable == 0){ 
			report += "There is no bike for you<br>";
			bikeToday = false; // return false if conditions are not met
		} else {
			report += "There are " + bikeAvailable + " bikes for you<br>";
		}

		// our arbitary threshold for air quality index
		if (airQuality < 50) { 
			bikeToday = false;
			report += "Air quality is bad<br>";
		} else {
			report += "Air quality is good: "+airQuality+"<br>";
		}

		// our arbitary threshold for temperature
		if (temperature < 10) { 
			bikeToday = false;
			report += "But it's too cold: "+temperature+"<br><br>";
		} else {
			report += "temperature is nice:" + temperature + "<br><br>";
		}

		// finally display the result
		if (bikeToday) { 
			report += "It's a good day to cycle!!!";
		} else {
			report += "It's not a good day to cycle";
		}

		content.html(report);
	}

	$('button').on('click', getLocation);
});






