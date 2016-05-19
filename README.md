# bike-today
demo web application using Thingful API to demonstrate simple "search" &amp; "get" API 


### logic of this app

* ask permission to get geolocation


* get geolocation  


* search for "bike", "weather" and "air quality" data around that geolocation, using [discovery API] (https://thingful.github.io/api-docs/) 


* parse the result  


* choose the "suitable" things from the result  


* get the actual real-time data for those things using interchange-ish API  


* parse the result  


* use the return values to do some simple calculation  


* show the result of calculation 

### Known issues
#### Chrome has issue with requesting geolocation from local file
* in terminal, go to the folder that store index.html
* run `python -m SimpleHTTPServer 8000`
* on Chrome, go to `http://localhost:8000/index.html`
