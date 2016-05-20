// Find user geolocation
function getLocation(callback) {

	if (navigator.geolocation) {		
		navigator.geolocation.getCurrentPosition(callback, showError);

	} else { 
		errors += "Geolocation is not supported by this browser..."
		console.log("Geolocation is not supported by this browser.");
	}
}

// handle errors when retrieving geolocation
function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			var errorContainer = document.createElement('div');
			errorContainer.innerHTML = geolocationSettings();
			document.getElementsByTagName('body')[0].appendChild(errorContainer);
			break;
		
		case error.POSITION_UNAVAILABLE:
			alert('Ooops! It seems there is no location information is unavailable.');
			break;
		
		case error.TIMEOUT:
			alert('Ooops! The request is taking too long. Maybe because of a bad internet connection?');
			break;
		
		case error.UNKNOWN_ERROR:
			alert('Ooops! An unknown error happened. Please try again.');
			break;
	}
}

// return formatted info about how to enable geolocation on 
// multiple browsers
function geolocationSettings() {
	var info = '<div id="overlay"><div id="alert"><div id="info">' +
	'<div id="close">X</div>' +
	'You must enable Geolocation to allow this application to work. ' + 
	'Click on one of the links below to find insturction about how to enable it.</div>' +
	'<a href="https://support.google.com/chrome/answer/142065?hl=en-GB" target="_blank">Google Chrome settings</a>' +
	'<a href="https://support.apple.com/en-gb/HT204690" target="_blank">Safari settings</a>' +
	'<a href="https://www.mozilla.org/en-GB/firefox/geolocation/" target="_blank">Firefox settings</a>' +
	'<a href="http://windows.microsoft.com/en-us/windows7/change-internet-explorer-9-privacy-settings" target="_blank">Internet Explorer</a>' +
	'</div></div>';

	return info;
}