var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name-input");
var displayCityEl = document.querySelector("#city-name");
var displayCityTemperatureEl = document.querySelector("#temperature");
var displayCityHumidityEl = document.querySelector("#humidity");
var displayCityWindSpeedEl = document.querySelector("#wind-speed");

cityFormEl.addEventListener("submit", formSubmitHandler);

function formSubmitHandler(event) {
  event.preventDefault();

  var cityname = cityInputEl.value.trim();
  // console.log(cityname);

  if (cityname) {
    getCityCoordinates(cityname);
    console.log(cityname);
    cityInputEl.value = "";
  } else {
    alert("Please enter a City destination");
  }
}

function getCityCoordinates(city) {
  var apiKey = "7ee8bad647ef3b941781af45cc24e7a9";
  var apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayCityWeather(data);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
}

function displayCityWeather(data) {
  var city = data.name;
  var cityLong = data.coord.lon;
  var cityLat = data.coord.lat;
  var cityCurrentHumidity = data.main.humidity;
  var cityCurrentTemp = data.main.temp;
  var cityCurrentWindSpeed = data.wind.speed;

  displayCityEl.textContent = `${city}`;
  displayCityTemperatureEl.textContent = `Temp: ${cityCurrentTemp}`;
  displayCityHumidityEl.textContent = `Humidity: ${cityCurrentHumidity}`;
  displayCityWindSpeedEl.textContent = `Wind Speed: ${cityCurrentWindSpeed}`;

  console.log(`${city}
  ${cityLong}
  ${cityLat}
  ${cityCurrentHumidity}
  ${cityCurrentTemp}
  ${cityCurrentWindSpeed}
  `);

  getCityForecast(city);
}

function getCityForecast(city) {
  var apiKey = "7ee8bad647ef3b941781af45cc24e7a9";
  var apiURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayCityForecast(data);
      });
    }
  });
}

function displayCityForecast(data) {
  for (var i = 0; i < data.length; i++) {}
}
