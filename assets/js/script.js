var citySearchBtn = document.querySelector(".search-btn")

// get weather API
var getWeather = function(lat, lon) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&excludeminutley&appid=b4c0d43d6254a59bf309892a9f0c0622";
  fetch(apiUrl)
    .then(function(response){
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log('data', data);
          return data
        })
      } else {
        // if not successful, redirect to homepage
        console.log('error');
      }
    });
}

// convert city name into lat long data for weahter api
var getLatLon = function(cityName) {
  var apiUrl ="http://api.positionstack.com/v1/forward"
    +"?access_key=86757d83a14fbb7c7de22531869cd15d"
    + "&query=" + cityName;
    fetch(apiUrl)
    .then(function(response){
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log('data', data);
    
          console.log('data lat long', );
          return data;
        })
      } else {
        // if not successful, redirect to homepage
        console.log('error');
      }
    });
};

citySearchBtn.addEventListener('click',function(){
  var cityName = document.getElementById('city');
  console.log('bntn click');
  console.log('city', cityName.value);
  
  getLatLon(cityName.value);

}) 

getWeather(40.7608, -111.8910);