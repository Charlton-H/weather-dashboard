var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name-input");
var displayCityEl = document.querySelector("#city-name");
var weatherIconEl = document.querySelector("#wicon");
var displayCityTemperatureEl = document.querySelector("#temperature");
var displayCityHumidityEl = document.querySelector("#humidity");
var displayCityWindSpeedEl = document.querySelector("#wind-speed");
// var displayCityUVIndexEl = document.querySelector("#uv");
var todaysDate = dayjs().format(`MMM Do, YYYY`);
var substitleEl = document.querySelector(".subtitle");
// console.log(todaysDate);
var forecastEl = document.getElementsByClassName("forecast");
var previousCityEl = document.querySelector("#previous-city-buttons");

cityFormEl.addEventListener("submit", formSubmitHandler);

var apiKey = "7ee8bad647ef3b941781af45cc24e7a9";

function formSubmitHandler(event) {
  event.preventDefault();

  var cityname = cityInputEl.value.trim();
  // console.log(cityname);

  clearWeatherContents();

  if (cityname) {
    getCityCoordinates(cityname);
    console.log(cityname);
    cityInputEl.value = "";
  } else {
    alert("Please enter a City destination");
  }
}

function createPreviousCityBtn(cityName) {
  var city = cityName.toUpperCase();
  // pass cityname from formSubmitHandler into this function
  var btn = document.createElement("button");
  // create button element with id="$cityname", class="btn", textContent="${city}"
  btn.setAttribute("id", `${city}`);
  btn.classList.add("btn");
  btn.textContent = `${city}`;
  previousCityEl.appendChild(btn);

  // create localStorage obj[key] value
}

function previousCityOnClick() {
  // create handler that listens to previous-city-buttons form
  // on click, take id and insert into formSubmitHandler
}

function getCityCoordinates(city) {
  var apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayCityWeather(data);
          createPreviousCityBtn(city);
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
  var cityUVIndex = data.uvi;
  var icon = JSON.stringify(data.weather[0].icon);
  icon = icon.replace('"', "");
  icon = icon.replace('"', "");
  var weatherIconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

  displayCityEl.textContent = `${city} (${todaysDate})`;
  weatherIconEl.setAttribute("src", weatherIconURL);
  displayCityTemperatureEl.textContent = `Temp: ${cityCurrentTemp} °F`;
  displayCityHumidityEl.textContent = `Humidity: ${cityCurrentHumidity} %`;
  displayCityWindSpeedEl.textContent = `Wind Speed: ${cityCurrentWindSpeed} MPH`;
  // displayCityUVIndexEl.textContent = `UV Index: ${cityUVIndex}`;
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
  var apiURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&exclude=current,hourly,minutely,alerts&appid=${apiKey}&units=imperial`;

  substitleEl.textContent = "5 Day Forecast:";

  fetch(apiURL)
    .then(function (response) {
      if (200 !== response.status) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }

      forecastEl[0].classList.add("forecast-days");

      response.json().then(function (data) {
        var fday = "";
        data.daily.forEach((value, index) => {
          if (index > 0 && index < 6) {
            // var dayname = new Date(value.dt * 1000).toLocaleDateString("en", {
            //   weekday: "long",
            // });
            var forecastDate = dayjs(value.dt * 1000).format("ddd, MMM Do");
            var icon = value.weather[0].icon;
            var temp = value.temp.day.toFixed(0);
            var humidity = value.humidity;
            var windSpeed = value.wind_speed;
            var iconURLStart = "http://openweathermap.org/img/wn/";
            var iconURLEnd = "@2x.png";
            fday = `<div class="forecast-day">
						<p>${forecastDate}</p><p> <span class="ico-${icon}" title="${icon}"><img src="${iconURLStart}${icon}${iconURLEnd}" style="width:50px"/></span></p>
						<div class="forecast-day-temp">Temp: ${temp}<sup>°F</sup></div>
            <div class="forecast-day-humidity">Humidity: ${humidity}</div>
            <div class="forecast-day-wind-speed">Wind: ${windSpeed}</div>
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

function clearWeatherContents() {
  displayCityEl.textContent = "";
  weatherIconEl.innerHTML = "";
  weatherIconEl.setAttribute("src", "");
  displayCityTemperatureEl.textContent = "";
  displayCityHumidityEl.textContent = "";
  displayCityWindSpeedEl.textContent = "";

  substitleEl.textContent = "";

  var forecastElIndex = forecastEl[0];

  if (forecastElIndex.hasChildNodes()) {
    // console.log("true");
    while (forecastElIndex.firstChild) {
      forecastElIndex.removeChild(forecastElIndex.lastChild);
    }
  }
}
