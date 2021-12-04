var citySearchBtn = document.querySelector(".search-btn");
var forecastEl= document.getElementById("forecast");


// get weather API
var getWeather = function(lat, lon, city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=b4c0d43d6254a59bf309892a9f0c0622&units=imperial`;
  fetch(apiUrl)
    .then(function(response){
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          currentWeather(city, data.current.temp, data.current.humidity, data.current.wind_speed, data.current.uvi, data.daily);
          console.log('data', data.daily);
          console.log("city", city);
        })
      } else {
        // if not successful, redirect to homepage
        console.log('location not found');
      }
    });
}

// convert city name into lat long data for weahter api
var getLatLon = function(city) {
  var apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b4c0d43d6254a59bf309892a9f0c0622&units=imperial`;

    fetch(apiUrl)
    .then(function(response){
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log('data', data);
          getWeather(data.coord.lat, data.coord.lon, data.name);
          return data;
        })
      } else {
        // if not successful, redirect to homepage
        console.log('error location not found');
      }
    })
    .catch(function(error){
      console.log("network error");
  });
}

citySearchBtn.addEventListener('click',function(event){
  event.preventDefault();
  // grabbing user defined city name
  var cityName = document.getElementById('city');
  console.log('bntn click');
  console.log('city', cityName.value.trim());

  // unhide the current weather box when user clicks search
  var currentWeatherContainer = document.querySelector("#hide");
  currentWeatherContainer.classList.remove('hidden');

  getLatLon(cityName.value.trim());
  saveCity(cityName.value.trim());
  
}) 

var currentWeather = function(city, temp, humidity, windspeed, uvindex, daily){
  console.log('city', city, 'temp', temp,'humidity', 
    humidity,'windspeed', windspeed,'uv index', 
    uvindex,'daily', daily );

  var date = moment().format("ddd, MMM, Do");
  console.log(date);
  currentCityDate= `${city} ${date}`;
  console.log('current city var', currentCityDate)
  // display current city on current weather
  var cityDate = document.getElementById("today-date")
  cityDate.textContent = currentCityDate

  // today humidity
  var todayHumidity = document.getElementById('today-humidity');
  todayHumidity.textContent = `humidity ${humidity}%`;
  // today uvi
  var todayHumidity = document.getElementById('today-uvi');
  todayHumidity.textContent = `uv index ${uvindex}`;

  // today windspeed
  var todayHumidity = document.getElementById('today-windspeed');
  todayHumidity.textContent = `wind: ${windspeed} mph`;

  // today-temp
  var todayHumidity = document.getElementById('today-temp');
  todayHumidity.textContent = `temp: ${temp}° F`;

  // display icon
  var todayIcon= daily[0].weather[0].icon;
  var iconUrl = `http://openweathermap.org/img/w/${todayIcon}.png`;
  $('#wicon').attr('src', iconUrl);

  daily.splice(6);
  // check that it cut off what you wanted
  for(var i=1;i<daily.length;i++) {

    // console logging data to check if correct
    console.log('dailyI',daily[i]);
    console.log(`humidity: ${daily[i].humidity}%`);
    console.log(`uv index: ${daily[i].uvi}`);
    console.log(`wind: ${daily[i].wind_speed} mph`);
    console.log(`temp: ${daily[i].temp.day}° F`);
    console.log(`weekday date: ${moment.unix(daily[i].dt).format("DD,MM")}`);
    console.log(`icon: ${daily[i].weather[0].icon}`);
    var forecastDate = moment.unix(daily[i].dt).format("ddd, MMM, Do");
    // create elements for card
    var fiveDayCard = document.createElement('card');
    fiveDayCard.classList.add('card');
    var cardHeader = document.createElement('h3');
    cardHeader.textContent = forecastDate;
    cardHeader.classList.add('card-header');
    // create list elements var for each card
    var listGroup = document.createElement("ul");
    var dailyTemp= document.createElement("li");
    var dailyWind= document.createElement("li");
    var dailyHum= document.createElement("li");
    var dailyUvi = document.createElement("li");
    var dailyIcon = document.createElement('img');

    // icon display
    var Icon= daily[i].weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/w/${Icon}.png`;
    dailyIcon.src= iconUrl;
    console.log('daily icon src', dailyIcon.src);
    
    // add that days text content
    dailyTemp.textContent = `temp: ${daily[i].temp.day}° F`;
    dailyWind.textContent = `wind: ${daily[i].wind_speed} mph`;
    dailyHum.textContent = `humidity: ${daily[i].humidity}%`;
    dailyUvi.textContent = `uv index: ${daily[i].uvi}`;
    // create card in forecast
    forecastEl.appendChild(fiveDayCard);
    fiveDayCard.appendChild(cardHeader);
    fiveDayCard.appendChild(listGroup);
    // append list el to above cards
    listGroup.appendChild(dailyIcon);
    listGroup.appendChild(dailyTemp);
    listGroup.appendChild(dailyWind);
    listGroup.appendChild(dailyHum);
    listGroup.appendChild(dailyUvi);
    

  };
}

var saveCity = function(cityName) {
  localStorage.setItem('city',cityName);
  alert(localStorage.getItem('city'));
  var cityListGroupEl = document.getElementById("city-list");

  // create childern elements
  var cityButton = document.createElement('button');
  var cityListItem = document.createElement('li');
  // put data into button child
  cityButton.textContent =localStorage.getItem('city');

  cityListItem.appendChild(cityButton);
  cityListGroupEl.appendChild(cityListItem);
  
  // need to style more later with classes?
  cityButton.classList.add('btn');
  cityButton.classList.add('btn-secondary');
  cityButton.classList.add('m-2');
  
  console.log(cityButton.classList);

  // if(cityName = past city name){
  //    do not append child.
  // }

  //   var buttonListGroup ;  

}
