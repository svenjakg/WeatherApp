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

// add a '0' for minutes < 10
function formatMinutes(minuteUnformatted) {
    let minuteFormatted = minuteUnformatted;
    
    if (minuteUnformatted < 10) {
        minuteFormatted = `0${minuteUnformatted}`;
    }

    return `${minuteFormatted}`;
}

// format current date
function getToday() {
    let now = new Date();

    let minute = formatMinutes(now.getMinutes());
    let hour = now.getHours();
    let day = days[now.getDay()];

    let text = `${day} ${hour}:${minute}`;

    return text;
}

// handle submit button (location)
function handleSubmitCity(event) {
    event.preventDefault();
    
    // access user input
    let userInput = document.querySelector("#search-text-input");
    let cityNameCapitalized = capitalizeWord(userInput.value);

    // inject user input into the page
    let injectCity = document.querySelector("#chosen-city");
    injectCity.innerHTML = cityNameCapitalized;

    let finalURL = `${apiOpenWeatherEndPoint}?q=${cityNameCapitalized}&appid=${apiOpenWeatherKey}&units=metric&lang=en`;
    
    axios.get(finalURL).then(injectCurrentWeather);
}

// convert temperature to Celsius
function convertCelsius() {
    let currentTemperatureCelsius = document.querySelector("#current-temperature");
    currentTemperatureCelsius.innerHTML = 19;
}

// convert temperature to Fahrenheit
function convertFahrenheit() {
    let currentTemperatureFahrenheit = document.querySelector("#current-temperature");
    currentTemperatureFahrenheit.innerHTML = 66;
}



// user interaction
// inject day of the week and current time
let injectToday = document.querySelector("#today");
injectToday.innerHTML = getToday();

// inject city
// inject default city when page is loaded
function injectCurrentWeather(response) {
    let defaultCity = document.querySelector("#chosen-city");
    defaultCity.innerHTML = response.data.name;

    let currentTemperatureCelsius = document.querySelector("#current-temperature");
    currentTemperatureCelsius.innerHTML = Math.round(response.data.main.temp);

    let currentDescription = document.querySelector(".location-container .weather-description");
    currentDescription.innerHTML = response.data.weather[0].main;

    let currentHumidity = document.querySelector(".location-container .humidity");
    currentHumidity.innerHTML = response.data.main.humidity;

    let currentWindSpeed = document.querySelector(".location-container .wind-speed");
    currentWindSpeed.innerHTML = Math.round(response.data.wind.speed);
}

// inject city submitted by user
let submitCity = document.querySelector("#search-form");
submitCity.addEventListener("submit", handleSubmitCity);

// inject weather for current location
let currentCity = document.querySelector("#current-button");
currentCity.addEventListener("click", getCurrentPosition);

// inject temperatur (Celsius)
let convertTemperatureCelsius = document.querySelector("#unit-celsius");
convertTemperatureCelsius.addEventListener("click", convertCelsius);

// inject temperature (Fahrenheit)
let convertTemperatureFahrenheit = document.querySelector("#unit-fahrenheit");
convertTemperatureFahrenheit.addEventListener("click", convertFahrenheit);



// interaction with OpenWeather
let apiOpenWeatherKey = "f54fc282cb1623303f99a2e0a7aedd4e";
let apiOpenWeatherEndPoint = "https://api.openweathermap.org/data/2.5/weather";

// construct the URL for the API from Open Weather
// based on current location
function buildOpenWeatherURLCoordinates(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let finalURL = `${apiOpenWeatherEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiOpenWeatherKey}&units=metric&lang=en`;

    axios.get(finalURL).then(injectCurrentWeather);
}

function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(buildOpenWeatherURLCoordinates);
}

navigator.geolocation.getCurrentPosition(buildOpenWeatherURLCoordinates);