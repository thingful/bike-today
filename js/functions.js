
"use strict";


var thingful = new Thingful();
thingful.setKey("1234567890");

var bikeResult = null;
var airQualityResult = null;
var weatherResult = null;

var lat, lon;






function getData(){

	thingful.get('q=bike&lat='+'lat='+lat+'long='+lon+'radius=500', function(data){
		bikeResult = data;
		// console.log(data); // we can do something with data here
		allDataReceived();
	});

	thingful.get('q=airquality', function(data){
		airQualityResult = data;
		// console.log(data); // we can do something with data here
		allDataReceived();
	});

	thingful.get('q=weather', function(data){
		weatherResult = data;
		// console.log(data); // we can do something with data here
		allDataReceived();
	});


}


function allDataReceived(){
	if(bikeResult && airQualityResult && weatherResult){
		console.log("all data received");
		console.log(bikeResult);
		console.log(airQualityResult);
		console.log(weatherResult);
		calculateValue();
	}

}


function calculateValue(){
	var bikeID = bikeResult.data[0].attributes.channels[0].id;
	var bikeAvailable = bikeResult.data[0].attributes.channels[0].value;

	console.log(bikeID + " = " + bikeAvailable);

	var airQualityID = airQualityResult.data[0].attributes.channels[0].id;
	var airQuality = airQualityResult.data[0].attributes.channels[0].value;

	console.log(airQualityID + " = " + airQuality);


	var tempuratureID = weatherResult.data[0].attributes.channels[3].id;
	var tempurature = weatherResult.data[0].attributes.channels[3].value;

	console.log(tempuratureID + " = " + tempurature);

	var bikeToday = true;
	var report = "";
	if(bikeAvailable == 0){
		report += "there is no bike for you<br>";
		console.log("there is no bike for you");
		bikeToday = false;
	}else{
		report += "there is " + bikeAvailable + " bike for you<br>";
		console.log("there is " + bikeAvailable + " bike for you");
	}

	if(airQuality < 50){
		bikeToday = false;
		report += "air quality is bad<br>";
		console.log("air quality is bad");
	}else{
		report += "air quality is good: "+airQuality+"<br>";
		console.log("air quality is good");
	}

	if(tempurature < 10){
		bikeToday = false;
		report += "but it's too cold: "+tempurature+"<br><br>";
		console.log("it's too cold");
	}else{
		report += "tempurature is nice:" + tempurature + "<br><br>";
		console.log("tempurature is nice:" + tempurature);
	}

	if(bikeToday){
		report += "it's good day to cycle!!!";
		console.log("it's good day to cycle!!!");
	}else{
		report += "it's not good day to cycle";
		console.log("it's not good day to cycle");
	}

	var x = document.getElementById("content");

	x.innerHTML = report;
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
    	console.log("Geolocation is not supported by this browser.");
        // x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
	lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log("lat = " + lat);
    console.log("lon = " + lon);
}




