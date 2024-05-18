const iconElement = document.querySelector(".weather-icon");
const locationIcon = document.querySelector(".location-icon");
const tempElement = document.querySelector(".temprature-value p");
const descElement = document.querySelector(".temprature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

var input = document.getElementById("search");
let flag = 0;
let city = "";
let latitude = 0.0;
let longitude = 0.0;
 
const weather = {};
weather.temprature = {
  unit: "celsius",
};
const KELVIN = 273;
const key = "b3aaa0b3323c0baab93aff38f75b44cb";

input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      
      event.preventDefault();
      if(notificationElement.style.display != "block")
      document.getElementById('loader').style.display='block';
      city = input.value;
      console.log(city);
      input.value = "";
      getCoordinates(city); // Call the function to get coordinates by city name
    }
  });

  // by clicking on the location icon also same thing should happen 
  locationIcon.addEventListener('click',function(){

    city = input.value;
    if(flag === 0)
        document.getElementById('loader').style.display='block';
    input.value = "";
    getCoordinates(city);
  })
  
  function getCoordinates(city) {
    let geocodingApi = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
    
    fetch(geocodingApi)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        if (data.length > 0) {
          let latitude = data[0].lat;
          let longitude = data[0].lon;
          console.log("Latitude:", latitude, "Longitude:", longitude);
          getWeather(latitude, longitude); // Fetch weather data using coordinates
        } else {
          console.log("No coordinates found for the city:", city);
          notificationElement.style.display = "block";
          notificationElement.innerHTML = "<p>Browser doesnt supprt location</p>";
        }
      })
      .catch((error) => console.log(error));
  }
let data = {}
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  fetch(api)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
        console.log(data);
        data = data;
        weather.temprature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.country = data.sys.country;
        weather.lat = data.coord.lat;
        weather.lon = data.coord.lon;
        weather.temp_min = data.main.temp_min;
        weather.temp_max = data.main.temp_max;
        weather.location = data.name;
        weather.dt = data.dt;
        weather.sunrise = data.sys.sunrise;
        weather.sunset = data.sys.sunset;
        weather.visibility = data.visibility;
        weather.windSpeed = data.wind.speed;
        weather.pressure = data.main.pressure;
        weather.humidity = data.main.humidity;
        console.log(weather);
        displayWeather(); // Corrected function name
    })
    .catch((error) => console.log(error));

}
function displayWeather() {
  notificationElement.style.display = "block";
  if(notificationElement.style.display === "block")
    document.getElementById('loader').style.display='none';
  const cityNameElement = document.getElementById("city-name");
  cityNameElement.innerHTML = `Location: ${weather.location}(${city}) , ${weather.country}`;
  document.getElementById('lat').innerHTML = `lat: ${weather.lat}`;
  document.getElementById('lon').innerHTML = `lon: ${weather.lon}`;
  iconElement.innerHTML = `<img src = "icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `Temp: ${weather.temprature.value}°<span>C</span>`;
  

        
        const temperatureElement = document.getElementById("temperature");
        const weatherDescriptionElement = document.getElementById("weather-description");
        temperatureElement.textContent = `Min Temp: ${Math.floor(weather.temp_min - 273)}° C , Max Temp: ${Math.floor(weather.temp_max - 273)}° C`; // Adjust temperature unit as needed
        weatherDescriptionElement.textContent = `Weather: ${weather.description}`;
        
        const date = new Date(weather.dt*1000);
        document.getElementById('date').innerHTML = `date : ${date.toLocaleString()}`;

        const sunRise = new Date(weather.sunrise * 1000);
        const sunSet = new Date(weather.sunset * 1000);
        document.getElementById('sunrise').innerHTML = `sunrise : ${sunRise.toLocaleTimeString()}`;
        document.getElementById('sunset').innerHTML = `sunset : ${sunSet.toLocaleTimeString()}`;
        document.getElementById('visibility').innerHTML = `visibility : ${weather.visibility} meter`;
        document.getElementById('wind-speed').innerHTML = `wind speed : ${weather.windSpeed} m/s`;
        document.getElementById('pressure').innerHTML = `pressure : ${weather.pressure} hPa`;
        document.getElementById('humidity').innerHTML = `humidity : ${weather.humidity} %`;


        // cloudinessElement.textContent = `Cloudiness: ${weather.Clouds}%`;
        // humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
        // windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  
}
