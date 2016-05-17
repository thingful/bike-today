
"use strict";

// var x, lat, lon, object;


var thingful = new Thingful();
thingful.setKey("1234567890");

var bikeResult = null;
var airQualityResult = null;
var weatherResult = null;



function getBike(){
	thingful.get('q=bike', function(data){
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

	var x = document.getElementById("demo");

	x.innerHTML = report;
}




// function setup(){
// 	console.log("loading stuff");
// 	x = document.getElementById("demo");
// 	object = JSON.parse('[1, 5, "false"]');
// 	console.log(object);
// 	tf = new Thingful("1234567890");
// 	console.log(tf);
// }


// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//         lat = position.coords.latitude;
//         lon = position.coords.longitude;
//     } else { 
//         x.innerHTML = "Geolocation is not supported by this browser.";
//     }
// }

// function showPosition(position) {
// 	// console.log(x);
// 	console.log("lat = " + position.coords.latitude); // i can get this but the innerHTML doesn't work
//     document.getElementById("demo").innerHTML = "Latitude: " + position.coords.latitude + 
//     "<br>Longitude: " + position.coords.longitude;	
// }

// function myCallBack(param1){
// 	console.log("param1 =");
// 	console.log(param1);
// }


