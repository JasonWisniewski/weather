var citySearchBtn = document.querySelector(".search-btn");
var forecastEl= document.getElementById("forecast");
var currentWeatherContainer = document.querySelector("#hide");
var saveArray = [];

// get weather API
var getWeather = function(lat, lon, city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=b4c0d43d6254a59bf309892a9f0c0622&units=imperial`;
  fetch(apiUrl)
    .then(function(response){
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          currentWeather(city, data.current.temp, data.current.humidity, data.current.wind_speed, data.current.uvi, data.daily);
          console.log('data current', data.current);
          console.log("city", city);
          buttonCreate(city);
        })
      } else {
        // if not successful alert not found please try again
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

  getLatLon(cityName.value.trim());
  saveCity(cityName.value.trim());

  // clear 5 day forecaset div
  fiveDayEl = ""; 
  uvindex ="";
}) 

var currentWeather = function(city, temp, humidity, windspeed, uvindex, daily){
  console.log('city', city, 'temp', temp,'humidity', 
    humidity,'windspeed', windspeed,'uv index', 
    uvindex,'daily', daily );

  currentWeatherContainer.classList.remove('hidden');
  var date = moment().format("ddd MMM Do");
  console.log(date);
  currentCityDate= `${city} - ${date}`;
  console.log('current city var', currentCityDate)
  // display current city on current weather
  var cityDate = document.getElementById("today-date")
  cityDate.textContent = currentCityDate

  // today humidity
  var todayHumidity = document.getElementById('today-humidity');
  todayHumidity.textContent = `humidity: ${humidity}%`;
  // today uvi
  var todayUvi = document.getElementById('today-uvi');
  todayUvi.textContent = `uv index: ${uvindex}`;
  // clear previous searches class
  $(todayUvi).removeClass();
  // Color code UV index depending on serverity
  if (uvindex < 3){
    todayUvi.classList.add("btn")
    todayUvi.classList.add("btn-success");}
  else if (3 < uvindex && uvindex < 8){
    todayUvi.classList.add("btn");
    todayUvi.classList.add("btn-warning");}
  else if (uvindex > 8){
    todayUvi.classList.add("btn");
    todayUvi.classList.add("btn-danger");}

  // today windspeed
  var todayWind = document.getElementById('today-windspeed');
  todayWind.textContent = `wind: ${windspeed} mph`;

  // today-temp
  var todayTemp = document.getElementById('today-temp');
  todayTemp.textContent = `temp: ${temp}° F`;

  // display icon
  var todayIcon= daily[0].weather[0].icon;
  console.log(todayIcon);
  var iconUrl = `http://openweathermap.org/img/wn/${todayIcon}@2x.png`;
  $('#wicon').attr('src', iconUrl);
  forecastEl.innerHTML= "";

  daily.splice(6);
  // check that it cut off what you wanted
  for(var i=1;i<daily.length;i++) {
    
    // console logging data to check if correct
    console.log('dailyI',daily[i]);
    console.log(`humidity: ${daily[i].humidity}%`);
    console.log(`wind: ${daily[i].wind_speed} mph`);
    console.log(`temp: ${daily[i].temp.day}° F`);
    console.log(`weekday date: ${moment.unix(daily[i].dt).format("DD,MM")}`);
    console.log(`icon: ${daily[i].weather[0].icon}`);
    var forecastDate = moment.unix(daily[i].dt).format("ddd DD/MM");
    // create elements for card
    var fiveDayCard = document.createElement('card');
    fiveDayCard.classList.add('card');
    var cardHeader = document.createElement('h5');
    cardHeader.textContent = forecastDate;
    cardHeader.classList.add('card-header');
    // create list elements var for each card
    var divIntoForecast = document.createElement('div');
    var listGroup = document.createElement("ul");
    var dailyTemp= document.createElement("li");
    var dailyWind= document.createElement("li");
    var dailyHum= document.createElement("li");
    var dailyIcon = document.createElement('img');

    // icon display
    var Icon= daily[i].weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${Icon}@2x.png`;
    dailyIcon.src= iconUrl;
    console.log('daily icon src', dailyIcon.src);
    
    // add that days text content
    dailyTemp.textContent = `${daily[i].temp.day}° F`;
    dailyWind.textContent = `wind: ${daily[i].wind_speed} mph`;
    dailyHum.textContent = `humidity: ${daily[i].humidity}%`;

    // add classes to div parent
    divIntoForecast.classList.add("col");
    divIntoForecast.classList.add("d-flex");
    divIntoForecast.classList.add("flex-column");
    divIntoForecast.classList.add("p-1");
    
    // create card into forecast row
    forecastEl.appendChild(divIntoForecast);
    divIntoForecast.appendChild(fiveDayCard);
    fiveDayCard.appendChild(cardHeader);
    fiveDayCard.appendChild(listGroup);
    // append list el to above cards
    listGroup.appendChild(dailyIcon);
    listGroup.appendChild(dailyTemp);
    listGroup.appendChild(dailyWind);
    listGroup.appendChild(dailyHum);
  };
}

var saveCity = function(cityName) {
  saveArray.push(cityName);
  localStorage.setItem('city',JSON.stringify(saveArray)); 
}

var load = function () {
  if(!saveArray) {
    console.log('hit first if statment');
    return false;
  }
  else {}
  var loadCity = localStorage.getItem('city')
  saveArray = JSON.parse(loadCity) || [];
  console.log(saveArray);
  for (i=0; i < saveArray.length; i++){
    buttonCreate(saveArray[i]);
  }
}

var buttonCreate =function (city){

  var cityListGroupEl = document.getElementById("city-list");
  // create childern elements
  var cityButton = document.createElement('button');
  var cityListItem = document.createElement('li');
  // put data into button child
  cityButton.textContent =city;
  
  // append to html
  cityListItem.appendChild(cityButton);
  cityListGroupEl.appendChild(cityListItem);

  // bootstrap styling buttons
  cityButton.classList.add('btn');
  cityButton.classList.add('btn-secondary');
  cityButton.classList.add('m-2');

  cityButton.addEventListener('click',historySearch);
  
};

var historySearch = function(event){
  event.trigger;
  var cityButtonName = event.target.textContent
  getLatLon(cityButtonName);
};

load();
