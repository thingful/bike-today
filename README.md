# bike-today
[Demo web application](http://thingful.github.io/bike-today/) using simple [Thingful's search API](http://thingful.github.io/api-docs/)


### Logic of this app

* Ask permission to get geolocation


* Get geolocation  


* Search for "bike", "weather" and "air quality" data around that geolocation, using [search API] (https://thingful.github.io/api-docs/) 


* Parse the results  


* Choose the "suitable" things from the results  


* Use the return values to do simple calculation  


* Show the result of calculation 

### Known issues
#### Chrome has issue with requesting geolocation from local file
* in terminal, go to the folder that store index.html
* run `python -m SimpleHTTPServer 8000`
* on Chrome, go to `http://localhost:8000/index.html`
