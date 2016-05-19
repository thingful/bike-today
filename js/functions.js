
"use strict";


var thingful = new Thingful();

var bikeResult = null;
var airQualityResult = null;
var weatherResult = null;

var lat, lon;
var content;
var report = "";
 

function setup(){
	content = document.getElementById("content"); 
}


function getLocation() { // getting geolocation

    if (navigator.geolocation) {
    	report += "Getting geolocation..."
    	console.log("Getting geolocation");
        navigator.geolocation.getCurrentPosition( getData ); //call getData once received geolocation

    } else { 
    	report += "Geolocation is not supported by this browser..."
    	console.log("Geolocation is not supported by this browser.");
    }

    content.innerHTML = report;
}



function getData(position){

	lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log("lat = " + lat);
    console.log("lon = " + lon);

    report += "done<br><br>"
    content.innerHTML = report;


    //then we make 3 separate requests, for bike, air quality and weather
	report += "Requesting for bike <br>"
	thingful.get('q=bike&lat='+lat+'long='+lon+'radius=500&sort=distance&limit=5', function(data){
		bikeResult = data;
		allDataReceived(); // everytime we receive data back, check if we got everything we need
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

	report += "Waiting for responses...<br>"
	content.innerHTML = report;
}


function allDataReceived(){ // everytime we receive data back, check if we got everything we need
	if(bikeResult && airQualityResult && weatherResult){ // if we got everything we need, process the value
		report += "All responses received <br><br>"
		content.innerHTML = report;

		console.log("All responses received");
		console.log(bikeResult);
		console.log(airQualityResult);
		console.log(weatherResult);
		content.innerHTML = report;
		processValue();
	}

}


function processValue(){
	
	// first we find the values that we want to process
	// because the result is sorted by distance, we just pick the first one. 
	// but you may want to double check if this is really what you are looking for

	var bikeID = bikeResult.data[0].attributes.channels[0].id;
	var bikeAvailable = bikeResult.data[0].attributes.channels[0].value;

	console.log(bikeID + " = " + bikeAvailable);

	var airQualityID = airQualityResult.data[0].attributes.channels[0].id;
	var airQuality = airQualityResult.data[0].attributes.channels[0].value;

	console.log(airQualityID + " = " + airQuality);


	var tempuratureID = weatherResult.data[0].attributes.channels[3].id;
	var tempurature = weatherResult.data[0].attributes.channels[3].value;

	console.log(tempuratureID + " = " + tempurature);



	// then we process those values using a very simple logic

	var bikeToday = true; // this is the answer, with default value to true

	if(bikeAvailable == 0){ 
		report += "There is no bike for you<br>";
		console.log("There is no bike for you");
		bikeToday = false; // make it false if conditions are not met
	}else{
		report += "There are " + bikeAvailable + " bikes for you<br>";
		console.log("There are " + bikeAvailable + " bikes for you");
	}

	if(airQuality < 50){ // this is just arbitary threshold for air quality index
		bikeToday = false;
		report += "Air quality is bad<br>";
		console.log("Air quality is bad");
	}else{
		report += "Air quality is good: "+airQuality+"<br>";
		console.log("Air quality is good");
	}

	if(tempurature < 10){ // this is also arbitary threshold for temperature
		bikeToday = false;
		report += "But it's too cold: "+tempurature+"<br><br>";
		console.log("It's too cold");
	}else{
		report += "tempurature is nice:" + tempurature + "<br><br>";
		console.log("tempurature is nice:" + tempurature);
	}


	if(bikeToday){ // then we display the result
		report += "It's a good day to cycle!!!";
		console.log("It's a good day to cycle!!!");
	}else{
		report += "It's not a good day to cycle";
		console.log("It's not a good day to cycle");
	}


	content.innerHTML = report;
}






