// write your code here
// definition of functions
// capitalize words
function capitalizeWord(word) {
    let firstCharacter = word.charAt(0).toUpperCase();
    let residueString = word.slice(1).toLowerCase();

    return firstCharacter + residueString;
}

// date and time
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// add a '0' for minutes < 10 and hours < 10
function formatTime(timeUnformatted) {
    let timeFormatted = timeUnformatted;
    
    if (timeUnformatted < 10) {
        timeFormatted = `0${timeUnformatted}`;
    }

    return `${timeFormatted}`;
}

// format current date
function getToday() {
    let now = new Date();

    let minute = formatTime(now.getMinutes());
    let hour = formatTime(now.getHours());
    let day = days[now.getDay()];

    let text = `${day} ${hour}:${minute}`;

    return text;
}

// convert timestamp from OpenWeather API
function convertTimestamp(timestamp) {
    // convert to milliseconds
    let milliseconds = timestamp * 1000;

    let date = new Date(milliseconds);
    let minute = formatTime(date.getMinutes());
    let hour = formatTime(date.getHours());

    let output = `${hour}:${minute}`;

    return output;
}

// weather update timestamp
function lastUpdated(timestamp) {
    // convert to milliseconds
    let milliseconds = timestamp * 1000;

    let date = new Date(milliseconds);
    let day = days[date.getDay()];

    let output = `${day} ${convertTimestamp(timestamp)}`;

    return output;
}



// temperature
let celsiusTemperature = null;

// convert temperature to Celsius
function displayCelsiusTemperature(event) {
    event.preventDefault();

    convertTemperatureCelsius.classList.remove("inactive");
    convertTemperatureCelsius.classList.add("active");

    convertTemperatureFahrenheit.classList.remove("active");
    convertTemperatureFahrenheit.classList.add("inactive");

    let currentTemperatureCelsius = document.querySelector("#current-temperature");
    currentTemperatureCelsius.innerHTML = Math.round(celsiusTemperature);
}

// convert temperature to Fahrenheit
function displayFahrenheitTemperature(event) {
    event.preventDefault();

    convertTemperatureCelsius.classList.remove("active");
    convertTemperatureCelsius.classList.add("inactive");

    convertTemperatureFahrenheit.classList.remove("inactive");
    convertTemperatureFahrenheit.classList.add("active");

    let FahrenheitTemp = (celsiusTemperature * 9/5) + 32;

    let currentTemperatureFahrenheit = document.querySelector("#current-temperature");
    currentTemperatureFahrenheit.innerHTML = Math.round(FahrenheitTemp);
}



// user interaction
// inject day of the week and current time
let injectToday = document.querySelector("#today");
injectToday.innerHTML = getToday();

// inject current weather information
function injectCurrentWeather(response) {
    celsiusTemperature = response.data.main.temp;

    let defaultCity = document.querySelector("#chosen-city");
    defaultCity.innerHTML = response.data.name;

    let currentTemperatureCelsius = document.querySelector("#current-temperature");
    currentTemperatureCelsius.innerHTML = Math.round(response.data.main.temp);

    let currentDescription = document.querySelector(".location-container .weather-description");
    currentDescription.innerHTML = capitalizeWord(response.data.weather[0].description);

    let currentHumidity = document.querySelector(".location-container .humidity");
    currentHumidity.innerHTML = response.data.main.humidity;

    let currentWindSpeed = document.querySelector(".location-container .wind-speed");
    currentWindSpeed.innerHTML = Math.round(response.data.wind.speed);

    let timestampElement = document.querySelector("#timestamp");
    timestampElement.innerHTML = lastUpdated(response.data.dt);

    let currentIcon = document.querySelector("#current-weather-icon");
    currentIcon.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
    currentIcon.setAttribute("alt", response.data.weather[0].description);
}

function injectForecast(response) {
    let forecastPanel = document.querySelector("#forecast");
    forecastPanel.innerHTML = null;

    let forecastData = null;
    let forecastTimestamp = null;
    let iconID = null;
    let description = null;
    let tempMin = null;
    let tempMax = null;

    for (let index = 0; index < 6; index++) {
        forecastData = response.data.list[index];

        forecastTimestamp = convertTimestamp(forecastData.dt);

        iconID = forecastData.weather[0].icon;
        description = forecastData.weather[0].description;

        tempMin = Math.round(forecastData.main.temp_min);
        tempMax = Math.round(forecastData.main.temp_max);

        forecastPanel.innerHTML += `
                <div class="col-2">
                <div class="card">
                    <div class="card-body">
                        <span>${forecastTimestamp}</span>
                        <div>
                            <img
                                src="https://openweathermap.org/img/wn/${iconID}@2x.png"
                                alt="${description}"
                            />
                        </div>
                        <span><strong>${tempMax}°</strong> ${tempMin}°</span>
                    </div>
                </div>
                </div>`;
    }
}


// inject city submitted by user
let submitCity = document.querySelector("#search-form");
submitCity.addEventListener("submit", handleSubmitCity);

// inject weather for current location
let currentCity = document.querySelector("#current-button");
currentCity.addEventListener("click", getCurrentPosition);

// inject temperatur (Celsius)
let convertTemperatureCelsius = document.querySelector("#unit-celsius");
convertTemperatureCelsius.addEventListener("click", displayCelsiusTemperature);

// inject temperature (Fahrenheit)
let convertTemperatureFahrenheit = document.querySelector("#unit-fahrenheit");
convertTemperatureFahrenheit.addEventListener("click", displayFahrenheitTemperature);



// interaction with OpenWeather
let apiOpenWeatherKey = "f54fc282cb1623303f99a2e0a7aedd4e";
let apiOpenWeatherEndPoint = "https://api.openweathermap.org/data/2.5/weather";
let apiOpenWeatherEndPointForecast = "https://api.openweathermap.org/data/2.5/forecast";

// construct the URL for the API from Open Weather
// based on current location
function buildOpenWeatherURLCoordinates(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // current weather
    let finalURL = `${apiOpenWeatherEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiOpenWeatherKey}&units=metric&lang=en`;
    axios.get(finalURL).then(injectCurrentWeather);

    // forecast
    finalURL = `${apiOpenWeatherEndPointForecast}?lat=${latitude}&lon=${longitude}&appid=${apiOpenWeatherKey}&units=metric&lang=en`;
    axios.get(finalURL).then(injectForecast);
}

function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(buildOpenWeatherURLCoordinates);
}

// get current position of the user
navigator.geolocation.getCurrentPosition(buildOpenWeatherURLCoordinates);


// handle submit button (location)
function handleSubmitCity(event) {
    event.preventDefault();
    
    // access user input
    let userInput = document.querySelector("#search-text-input");
    let cityNameCapitalized = capitalizeWord(userInput.value);

    // inject user input into the page
    let injectCity = document.querySelector("#chosen-city");
    injectCity.innerHTML = cityNameCapitalized;

    // current weather
    let finalURL = `${apiOpenWeatherEndPoint}?q=${cityNameCapitalized}&appid=${apiOpenWeatherKey}&units=metric&lang=en`;
    axios.get(finalURL).then(injectCurrentWeather);

    // forecast
    finalURL = `${apiOpenWeatherEndPointForecast}?q=${cityNameCapitalized}&appid=${apiOpenWeatherKey}&units=metric&lang=en`;
    axios.get(finalURL).then(injectForecast);
}