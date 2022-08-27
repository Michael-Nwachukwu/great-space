let app = document.querySelector(".weather-showcase");
let degree = document.querySelector(".degree");
let degreeToggler = document.querySelector(".change-degree-style");
let temperature = document.querySelector(".temperature");
let temperatureSpan = document.querySelector("#degree-style");
let currentIcon = document.querySelector(".current-icon");
let weatherDescription = document.querySelector(".weather-description");
let btn = document.querySelector(".temperature-panel");
let cityName = document.querySelector(".city-name");
let district = document.querySelector(".district");
let time = document.querySelector(".time");
let date = document.querySelector(".date");
let humidityGlobal = document.querySelector(".humidity");
let sunRise = document.querySelector(".sunrise");

let tomorrowDateGlobal = document.querySelector(".tomorrow-date");
let tomorrowIconGlobal = document.querySelector(".tomorrow-icon");
let tomorrowWeatherGlobal = document.querySelector(
  ".tomorrow-weather-condition"
);
let tomorrowTemperatureGlobal = document.querySelector(".tomorrow-temperature");

let nextDayDateGlobal = document.querySelector(".nextday-date");
let nextDayIconGlobal = document.querySelector(".nextday-icon");
let nextDayWeatherGlobal = document.querySelector(".nextday-weather-condition");
let nextDayTemperatureGlobal = document.querySelector(".nextday-temperature");

let randomCityName = document.querySelector(".random-city-name");
let randomCityTemp = document.querySelector(".random-city-temperature");
let randomCityFeels = document.querySelector(".random-city-feels strong");
let randomCityCondition = document.querySelector(".random-city-condition");

let map = document.querySelector(".map");
let form = document.getElementById("locationinput");
let search = document.querySelector(".search-input");
let cities = document.querySelectorAll(".cities");
let indicator = document.querySelector(".degree");
let loop = document.querySelector(".loop-card");

let long;
let lat;
let cityInput;

let empt = [];

const randomCities = [
  "rome",
  "istanbul",
  "dubai",
  "seoul",
  "prague",
  "beijing",
  "kuala lumpur",
  "bangkok",
  "amsterdam",
  "mumbai",
  "shanghai",
  "vienna",
  "madrid",
];

// gets the latitude and longitude of users position
function getLocation() {
  if (navigator.geolocation) {
    //get current location with geolocation
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position);

      //long & lat = position coordinates
      long = position.coords.longitude;
      lat = position.coords.latitude;

      // pass lat & long as city input to get locations weather data
      cityInput = `${lat}, ${long}`;

      // calling function fetchWeatherData - this function handles fetching the location weather details and renders it to the dom. This function is defined below
      fetchWeatherData();

      return `${lat}, ${long}`;
    }, () => {
        cityInput = 'Abuja';
        fetchWeatherData();
    });
  }
}


// on windows load the function getLocation is fired which fetches the current position weather conditions and renders it
window.addEventListener("load", getLocation());

// forEch city in cities - (possible because of queryselectorAll retuns node list and accepts forEach method)
cities.forEach((city) => {
  // listen for click event to activate functions
  city.addEventListener("click", (e) => {
    //change from default city to clicked city
    cityInput = e.target.innerHTML;

    //function that fetches and displays all the data from the weather API
    fetchWeatherData();

    //fade out the app(simple animation)
    app.style.opacity = "0";
  });
});

//display data for searched locations
form.addEventListener("submit", (e) => {
  //throw an alert if input bar is empty
  if (search.value.length == 0) {
    alert("Please Enter City");
  } else {
    //change from default city to the one written in the input field
    cityInput = search.value;

    //function that fetches weather API
    fetchWeatherData();

    //clear input field
    search.value = "";

    //fade out the app(simple animation)
    app.style.opacity = "0";
  }
  //prevent default form behaviour
  e.preventDefault();
});

//function to fetch weather data and render it.
function fetchWeatherData() {
  // storing api url in a var
  const api = `https://api.weatherapi.com/v1/forecast.json?key=41a11634ce224c0789c101047220806&q=${cityInput}&days=5&aqi=no&alerts=yes`;

  fetch(api)
    .then((response) => {
      //converting response to json format
      let data = response.json();

      //display data obj in console
      console.log(data);

      //return converted data
      return data;
    })
    .then((data) => {
      //destructuring api data to desired parameters
      //data.current = received Api object
      const { temp_f, temp_c, humidity } = data.current;
      const { icon, text } = data.current.condition;
      const { country, localtime, region, name } = data.location;
      const sunrise = data.forecast.forecastday[0].astro.sunrise;
      const tomorrowDate = data.forecast.forecastday[1].date;
      const tomorrowIcon = data.forecast.forecastday[1].day.condition.icon;
      const tomorrowCondition = data.forecast.forecastday[1].day.condition.text;
      const { avgtemp_f, avgtemp_c } = data.forecast.forecastday[1].day;
      //----------------------------
      const nextDayDate = data.forecast.forecastday[2].date;
      const nextDayIcon = data.forecast.forecastday[2].day.condition.icon;
      const nextDayCondition = data.forecast.forecastday[2].day.condition.text;
      const nextDayavgtemp_f = data.forecast.forecastday[2].day.avgtemp_f;
      const nextDayavgtemp_c = data.forecast.forecastday[2].day.avgtemp_c;

      // set Dom Elements from the API
      cityName.textContent = name;
      district.textContent = `${country}-${region}`;
      temperature.innerHTML = temp_f + `<sup> &#176;F </sup>`;
      weatherDescription.textContent = text;
      currentIcon.src = icon;
      humidityGlobal.textContent = humidity;
      sunRise.textContent = sunrise;
      time.textContent = data.location.localtime;

      //Forecasts
      //tomorrow
      tomorrowDateGlobal.textContent = tomorrowDate;
      tomorrowWeatherGlobal.textContent = tomorrowCondition;
      tomorrowIconGlobal.src = tomorrowIcon;
      tomorrowTemperatureGlobal.textContent = avgtemp_f;

      //next day
      nextDayDateGlobal.textContent = nextDayDate;
      nextDayIconGlobal.src = nextDayIcon;
      nextDayWeatherGlobal.textContent = nextDayCondition;
      nextDayTemperatureGlobal.textContent = nextDayavgtemp_f;

      //toggle degree style
      degreeToggler.addEventListener("click", () => {
        if (temperatureSpan.textContent.includes("F")) {
          temperatureSpan.textContent = `°C`;
          temperature.textContent = temp_c;
          indicator.innerHTML = `°F` + "?";
          tomorrowTemperatureGlobal.textContent = avgtemp_c;
          nextDayTemperatureGlobal.textContent = nextDayavgtemp_c;
        } else if (temperatureSpan.textContent.includes("C")) {
          temperatureSpan.textContent = `°F`;
          temperature.textContent = temp_f;
          indicator.innerHTML = `°C` + "?";
          tomorrowTemperatureGlobal.textContent = avgtemp_f;
          nextDayTemperatureGlobal.textContent = nextDayavgtemp_f;
        }
      });

      //set de4lt time of day
      let timeOfDay = "day";

      //get the unique id for each weather condition
      const code = data.current.condition.code;

      //change to night if its night time in the city
      // when its day time is_day = 1, else not
      if (data.current.is_day != 1) {
        timeOfDay = "night";
      }
      if (code == 1000) {
        //weather is clear

        //set background image to clear if the weather is clear
        app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;

        //change the button bg color depending if its night or day

        btn.style.background = "#e5ba92";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
      }

      //same thing for cloudy weather
      else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
      ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;

        btn.style.background = "#fa6d1b";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
      } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
      ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = "#647d75";

        if (timeOfDay == "night") {
          btn.style.background = "325c80";
        }
        //and snow
      } else {
        app.style.background = `url(./images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = "#4d72aa";

        if (timeOfDay == "night") {
          btn.style.background = "#1b1b1b";
        }
      }
      //fade in the page once its all done
      app.style.opacity = "1";

      // setting map location to active city location
      map.innerHTML = `
        <div class="mapouter cards-size">
            <div class="gmap_canvas">
                <iframe style="border-radius: 35px;" width="100%" height="410" id="gmap_canvas" src="https://maps.google.com/maps?q= ${cityInput} &t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                    <a href="https://fmovies-online.net"></a>
                    <br>
                    <a href="https://www.embedgooglemap.net"></a>
            </div>
            </div>`;
    })
    .catch(() => {
      // if user inputs invalid location
      alert("city not found please enter valid city name");
      app.style.opacity = "1";
    });
}

// reeling Locations Card
//iterating over declared randomCities to perform func for each
for (let i = 0; i < randomCities.length; i++) {
  //set cityinput to result of loop
  cityInput = randomCities[i];

  //define seperate function to search only selected cities
  function fetchRandomWeatherData() {
    const api = `https://api.weatherapi.com/v1/forecast.json?key=41a11634ce224c0789c101047220806&q=${cityInput}&days=5&aqi=no&alerts=yes`;

    fetch(api)
      .then((response) => {
        //converting response to json format
        let data = response.json();

        //return converted data
        return data;
      })
      .then((data) => {
        //push data into empty array
        empt.push(data);

        // console.log(empt);
      });
  }

  //calling function to fetch after iteration
  fetchRandomWeatherData();
}

//function to render randomcities data to the dom
//  parameter rand because a math funtion generates a number within the cities length and this function displays the correspopnding city according to its index.
function getActualRandom(rand) {
  // //random cities data
  randomCityName.textContent = `${empt[rand].location.name}, ${empt[rand].location.country}`;
  randomCityTemp.textContent = empt[rand].current.temp_f + `°F`;
  randomCityFeels.textContent = empt[rand].current.feelslike_f;
  randomCityCondition.textContent = empt[rand].current.condition.text;
}

//on intervals of 10secs
setInterval(() => {
  //generate number from 0-13 to display index city
  let rand = Math.floor(Math.random() * 13) + 1;

  // console.log(rand);

  // calling function to display selected data
  getActualRandom(rand);
}, 10000);
