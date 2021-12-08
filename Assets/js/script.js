var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name-input");
var displayCityEl = document.querySelector("#city-name");
var weatherIconEl = document.querySelector("#wicon");
var displayCityTemperatureEl = document.querySelector("#temperature");
var displayCityHumidityEl = document.querySelector("#humidity");
var displayCityWindSpeedEl = document.querySelector("#wind-speed");
var todaysDate = dayjs().format(`MMM Do, YYYY`);
// console.log(todaysDate);
var forecastEl = document.getElementsByClassName("forecast");

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
  var icon = JSON.stringify(data.weather[0].icon);
  icon = icon.replace('"', "");
  icon = icon.replace('"', "");
  var weatherIconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

  displayCityEl.textContent = `${city} (${todaysDate})`;
  weatherIconEl.setAttribute("src", weatherIconURL);
  displayCityTemperatureEl.textContent = `Temp: ${cityCurrentTemp} °F`;
  displayCityHumidityEl.textContent = `Humidity: ${cityCurrentHumidity} %`;
  displayCityWindSpeedEl.textContent = `Wind Speed: ${cityCurrentWindSpeed} MPH`;

  console.log(`${city}
  ${cityLong}
  ${cityLat}
  ${cityCurrentHumidity}
  ${cityCurrentTemp}
  ${cityCurrentWindSpeed}
  ${icon}
  `);

  fetchForecast(data);
}

function fetchForecast(data) {
  var cityLong = data.coord.lon;
  var cityLat = data.coord.lat;
  console.log(`${cityLat} ; ${cityLong}`);
  var apiKey = "7ee8bad647ef3b941781af45cc24e7a9";
  var apiURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&exclude=current,hourly,minutely,alerts&appid=${apiKey}&units=imperial`;

  fetch(apiURL)
    .then(function (response) {
      if (200 !== response.status) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }

      forecastEl[0].classList.add("loaded");

      response.json().then(function (data) {
        var fday = "";
        data.daily.forEach((value, index) => {
          if (index > 2) {
            var dayname = new Date(value.dt * 1000).toLocaleDateString("en", {
              weekday: "long",
            });
            var icon = value.weather[0].icon;
            var temp = value.temp.day.toFixed(0);
            fday = `<div class="forecast-day">
						<p>${dayname}</p>
						<p><span class="ico-${icon}" title="${icon}"></span></p>
						<div class="forecast-day--temp">${temp}<sup>°F</sup></div>
					</div>`;
            forecastEl[0].insertAdjacentHTML("beforeend", fday);
          }
        });
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
}
