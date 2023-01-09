var apiKey = "IIgtBoGEsnf68Me23pXpWGZnkn5vaiyA";
var city = 'Brunswick'; //takes input from search bar //Brunswick
var locationKey;
var maxTemp;
var maxUnit; 
var minTemp;
var minUnit;
var forecastDate;


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
    var dateArray;
    var newDate;
    // make call to another api using location key

    //var apiKey = "IIgtBoGEsnf68Me23pXpWGZnkn5vaiyA";
    var requestUrl = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locationKey + "?apikey=" + apiKey;

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        //console.log(data.DailyForecasts[0].Temperature);

        for(var i=0; i < 5; i++){
            //console.log('Test');

            forecastDate = data.DailyForecasts[i].Date;
            dateArray = forecastDate.split("T")
            newDate = dateArray[0]

            maxTemp = data.DailyForecasts[i].Temperature.Maximum.Value
            maxUnit = data.DailyForecasts[i].Temperature.Maximum.Unit

            maxTemp = maxTemp + " " +  maxUnit;

            minTemp = data.DailyForecasts[i].Temperature.Minimum.Value
            minUnit = data.DailyForecasts[i].Temperature.Minimum.Unit

            minTemp = minTemp + " " + minUnit;

            console.log(newDate);
            console.log(maxTemp);
            console.log(minTemp);

            
        }

    });
}

getApi();


