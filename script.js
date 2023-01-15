var apiKey = "IIgtBoGEsnf68Me23pXpWGZnkn5vaiyA";
var city; //takes input from search bar //Brunswick
var submitButtonEl = document.getElementById('search-btn-1');
var locationKey;
var maxTemp;
var maxUnit; 
var minTemp;
var minUnit;
var forecastDate;
var searchValue;
var dayDesc;
var nightDesc;
// This section added by Don Ishan 
var generateBtn = document.querySelector('.generate_btn');
var num_facts = document.querySelector("#num_facts");


submitButtonEl.addEventListener('click',function(){
    //console.log("Test click"); 

    var searchInputVal = document.getElementById('search-location-1').value;
    //console.log(searchInputVal); 
    getApi(searchInputVal) 

})

function getApi(searchValue){

    //console.log(searchValue); 
    city = searchValue;
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
    var weatherContent = document.querySelector('#container-weather');
    
    

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

            var iconID = data.DailyForecasts[i].Day.Icon
            //console.log(iconID);

            if(iconID >=1 && iconID <= 9){
                iconID = '0' + iconID
                console.log('Inside if');
                console.log(iconID);
            }

            var icon = 'https://developer.accuweather.com/sites/default/files/' + iconID + '-s.png';

            dayDesc = data.DailyForecasts[i].Day.IconPhrase;
            nightDesc = data.DailyForecasts[i].Night.IconPhrase;


            console.log(newDate); // replace with creating div tags for each result 
            console.log(maxTemp);
            console.log(minTemp);
            console.log(dayDesc);
            console.log(nightDesc);
            console.log(icon);

            // card container for the weather forecast body 
            var resultCard = document.createElement('div'); // card // csss for this card  // use addclass on this dov class =  content
            resultCard.classList.add('content');
            // body container for forecast content 
            var resultBody = document.createElement('div'); // body of the card // css for body card 

            resultCard.append(resultBody); // appends the body to that card 

            var titleEl = document.createElement('h3'); // creates the elemnets fior the body
            titleEl.textContent = "Weather Forecast";
            
            var img = document.createElement('img'); // revert to previous  and then addclass image is -4by3
            img.classList.add('image is-4by3');
            img.src = icon;
            var bodyContentEl = document.createElement('p')

            bodyContentEl.innerHTML = '<strong>Date:</strong>' + newDate + '<br/>';
            bodyContentEl.innerHTML += '<strong>Maximum Temp:</strong>' + maxTemp + '</br>';
            bodyContentEl.innerHTML += '<strong>Minimum Temp:</strong>' + minTemp + '</br>';
            bodyContentEl.innerHTML += '<strong>Day:</strong>' + dayDesc + '</br>';
            bodyContentEl.innerHTML += '<strong>Night:</strong>' + nightDesc + '</br>';

            resultBody.append(titleEl, img, bodyContentEl); // appends the date, temp to the body 
            weatherContent.append(resultCard); // append the card to the div in the html 
            
        }

    });
}

//getApi();

window.onload = initMap;

let map;
let service;
let locationResults;
let searches = [];
let locationSaved = false;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -37.8136, lng: 144.9631 },
    zoom: 13,
  });

  var marker = new google.maps.Marker({
    position: { lat: -37.8136, lng: 144.9631 },
    map: map,
  });

  function moveToLocation() {
    if (!locationSaved) {
      locationSaved = true;
      var location = document.getElementById("search-location-1").value;
      searches.push(location);
      localStorage.setItem('Location Search', JSON.stringify(searches));
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, function (results, status) {
      if (status === "OK") {
        map.setCenter(results[0].geometry.location);
        locationResults = results[0].geometry.location;
        searchWalkingTrails();
      } else {
        alert("Geocode was not successful for this location");
      }
    });
  }
  }

  function searchWalkingTrails() {
    var request = {
      location: locationResults,
      radius: 10000, // 10 km
      types: ["park"],
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  }

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var counter = 0;
        var images = document.getElementsByClassName("image is-4by3");
        var contents = document.getElementsByClassName("content");
        for (var i = 0; i < results.length; i++) {
            if (counter >= 3) {
                break;
            }
            var place = results[i];
            createMarker(results[i]);
            console.log(place);
            images[counter].innerHTML = "<img src='" + place.photos[0].getUrl() + "' alt='" + place.name + "'>";
            contents[counter].innerHTML = "<p>" + place.name + "</p>";
            contents[counter].innerHTML += "<p>" + place.vicinity + "</p>";
            counter++;
        }
    }
  }

  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: './assets/images/icons8-oak-tree-30.png',
    });
  }
  document
    .getElementById("search-btn-1")
    .addEventListener("click", function () {
      moveToLocation();
    });
}


// Fast Fact Section Start from here 
generateBtn.addEventListener("click", function(){
   

  if(parseInt(num_facts.value) > 50){
    alert("MAX IS 50 ..!")
  }
 
  function fetchFacts(){

   fetch(`https://api.api-ninjas.com/v1/facts?limit=1`, {
       method: 'GET',
       headers: {
           'X-Api-Key': 'QXXx6GBxBEhrdby8y5MvX9DHdQTW7ZDpkjziXBOC',
       },  
   })
   .then(response => response.text() ) // JSON strings convert to JavaScript Object
   .then(data => {
       var factsRes = JSON.parse(data);
       console.log(factsRes);
       let para = document.createElement("p");
       let node = document.createTextNode(factsRes);
       para.appendChild(node);

       let factElement = document.querySelector(".facts");
       factElement.appendChild(para);

   })
   .catch(err => console.log(err));
}

// close button create

   var btn = document.createElement("button");
   btn.innerHTML = 'Clear';
   btn.classList.add("btn");
   btn.classList.add("clear");
   var clear = document.querySelector(".sec_1");
   clear.appendChild(btn);
   
   const clear_btn = document.querySelector('.clear');
      clear_btn.addEventListener('click', function() {
       let facts = document.querySelector(".facts");
       facts.innerHTML = '';
       clear_btn.parentNode.removeChild(clear_btn);
      })



   for (var i=0; i<num_facts.value; i++){
       fetchFacts();
   }
   
})
