
"use strict";

jQuery(document).ready(function($) {
	var thingful = new Thingful();
	var bikeResult = null;
	var airQualityResult = null;
	var weatherResult = null;
	var lat, lon;
	var errors; 

	// Find user geolocation
	function getLocation() {

		$('button').remove();

	    if (navigator.geolocation) {
	    	var logs = "Getting geolocation...";
	    	
	    	// call getData once received geolocation
	        navigator.geolocation.getCurrentPosition(getData, showError);


	    } else { 
	    	errors += "Geolocation is not supported by this browser..."
	    	console.log("Geolocation is not supported by this browser.");
	    }

	    $( "#content" ).append( '<div class="logs"><p>' + logs + '</p></div>' );
	}


	//error handling for location checking
	function showError(error) {
	    switch(error.code) {
	        case error.PERMISSION_DENIED:
	        	$('.errors').html("User denied the request for Geolocation.");
	            console.log("User denied the request for Geolocation.");
	            break;
	        case error.POSITION_UNAVAILABLE:
	        	$('.errors').html("Location information is unavailable.");
	            console.log("Location information is unavailable.");
	            break;
	        case error.TIMEOUT:
	        	$('.errors').html("The request to get user location timed out.");
	            console.log("The request to get user location timed out.");
	            break;
	        case error.UNKNOWN_ERROR:
	        	$('.errors').html("An unknown error occurred.");
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
	    
		var logs = "Requesting for bike<br>"
		thingful.get('q=bike&lat='+lat+'long='+lon+'radius=500&sort=distance&limit=5', function(data){
			bikeResult = data;
			allDataReceived();
		});

		logs += "Requesting for air quality<br>"
		thingful.get('q=airquality&lat='+lat+'long='+lon+'radius=500&sort=distance&limit=5', function(data){
			airQualityResult = data;
			allDataReceived();
		});

		logs += "Requesting for weather<br><br>"
		thingful.get('q=weather&lat='+lat+'long='+lon+'radius=500&sort=distance&limit=5', function(data){
			weatherResult = data;
			allDataReceived();
		});

		logs += "Waiting for responses...";
		$( "#content" ).find('.logs').append('<p>' + logs + '</p>');
		$( "#content" ).find('.logs').append('<img id="loading-wheel" src="/images/loading-wheel.svg" />');

		// show loading wheel
		$('#loading-wheel ').fadeIn('slow');
	}

	// Ensure all the necessary data is available before processing the data
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
	// It is recommended to always check values before using them.
	function processValue() {
		$('#loading-wheel ').fadeOut('fast');

		var response = '';
		var summary = '<h3>SUMMARY</h3>';

		var bikeID = bikeResult.data[0].attributes.channels[0].id;
		var bikeAvailable = bikeResult.data[0].attributes.channels[0].value;

		var airQualityID = airQualityResult.data[0].attributes.channels[0].id;
		var airQuality = airQualityResult.data[0].attributes.channels[0].value;

		var temperatureID = weatherResult.data[0].attributes.channels[3].id;
		var temperature = weatherResult.data[0].attributes.channels[3].value;


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
			summary += "<p>Air quality is good: "+airQuality+"</p>";
		}

		// our arbitary threshold for temperature
		if (temperature < 10) { 
			bikeToday = false;
			summary += "<p>But it's too cold: "+temperature+"</p>";
		} else {
			summary += "<p>Temperature is nice: " + temperature + "</p>";
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

	$('button').on('click', getLocation);
});