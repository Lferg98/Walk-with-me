var apiKey = "IIgtBoGEsnf68Me23pXpWGZnkn5vaiyA";
var city = 'Brunswick'; //takes input from search bar //Brunswick
var locationKey;



function getApi(){
    var requestUrl = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?q=" + city + "&apikey=" + apiKey;

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        
        for(var i=0; i < data.length; i++)
        {

            if(data[i].Country.ID == 'AU' && data[i].LocalizedName == city)
            {
                //countryID = data[i].Country.ID;
                locationKey = data[i].Key;
                getForecastApi();
            }    
        }   
    });    
}



function getForecastApi(){
    console.log(locationKey);
    // make call to another api using location key

    //var apiKey = "IIgtBoGEsnf68Me23pXpWGZnkn5vaiyA";
    var requestUrl = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locationKey + "?apikey=" + apiKey;

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
    });
}

getApi();


