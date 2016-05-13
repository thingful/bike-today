function getLocation() {
	console.log("hello world");

	if ("geolocation" in navigator) {
  /* geolocation is available */
  		console.log("got it");
	} else {
	  /* geolocation IS NOT available */
	  console.log("not got it");
	}
}

function showPosition(position) {
	console.log("show position");
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
}