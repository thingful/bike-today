
"use strict";

var x, lat, lon, object;


var thingful;
var result1 = null;
var result2 = null;
var result3 = null;


$( document ).ready(function() {
 	
	thingful = new Thingful();

	thingful.setKey("1234567890");
 
});


function getBike(){
	thingful.get('q=bike', function(data){
		result1 = data;
		// console.log(data); // we can do something with data here
		allDataReceived();
	});

	thingful.get('q=airquality', function(data){
		result2 = data;
		// console.log(data); // we can do something with data here
		allDataReceived();
	});

	thingful.get('q=weather', function(data){
		result3 = data;
		// console.log(data); // we can do something with data here
		allDataReceived();
	});


}


function allDataReceived(){
	if(result1 && result2 && result3){
		console.log("all data received");
		console.log(result1);
		console.log(result2);
		console.log(result3);
		calculateValue();
	}

}


function calculateValue(){
	var bikeID = result1.data[0].attributes.channels[0].id;
	var bikeAvailable = result1.data[0].attributes.channels[0].value;

	console.log(bikeID + " = " + bikeAvailable);

	var airQualityID = result2.data[0].attributes.channels[0].id;
	var airQuality = result2.data[0].attributes.channels[0].value;

	console.log(airQualityID + " = " + airQuality);


	var tempuratureID = result3.data[0].attributes.channels[3].id;
	var tempurature = result3.data[0].attributes.channels[3].value;

	console.log(tempuratureID + " = " + tempurature);

	var bikeToday = true;

	if(bikeAvailable == 0){
		console.log("no bike for you, sorry");
		bikeToday = false;
	}else{
		console.log("there is " + bikeAvailable + " for you");
	}

	if(airQuality < 50){
		bikeToday = false;
		console.log("air quality is bad");
	}else{
		console.log("air quality is OK");
	}

	if(tempurature < 10){
		bikeToday = false;
		console.log("it's too cold");
	}else{
		console.log("tempurature is nice:" + tempurature);
	}
	
	if(bikeToday){
		console.log("it's good day to cycle!!!");
	}else{
		console.log("it's not good day to cycle");
	}

	
}




function setup(){
	console.log("loading stuff");
	x = document.getElementById("demo");
	object = JSON.parse('[1, 5, "false"]');
	console.log(object);
	tf = new Thingful("1234567890");
	console.log(tf);
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        lat = position.coords.latitude;
        lon = position.coords.longitude;
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
	// console.log(x);
	console.log("lat = " + position.coords.latitude); // i can get this but the innerHTML doesn't work
    document.getElementById("demo").innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;	
}

function myCallBack(param1){
	console.log("param1 =");
	console.log(param1);
}


