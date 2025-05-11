const apiKey = "500912b1ea5bc139ce42912a9311ad6d";
let weatherIcon = document.getElementById("weatherIcon");
let temperature = document.getElementById("temperature");
let cityInput = document.getElementById("cityInput");
let searchBtn = document.getElementById("searchBtn");
let cityName = document.getElementById("cityName");
let humidityP = document.getElementById("humidityP");
let windP = document.getElementById("windP");

navigator.geolocation.getCurrentPosition((position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  console.log(lat, lon);
  
  let data = fetchWeather(lat, lon);

  data.then((res) => {
    dislayWeather(res);
  });
});

const getCoordinates = async (city) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.length > 0) {
    const { lat, lon } = data[0];
    return { lat, lon };
  } else {
    return null;
  }
};

searchBtn.addEventListener("click", async () => {
  let cityInputValue = cityInput.value;
  cityInputValue = cityInputValue.toLowerCase();

  if (cityInputValue.length < 3) {
    cityInput.value = "";
    cityInput.placeholder = "Plz Enter Valid City";
  } else {
    try {
      let { lat, lon } = await getCoordinates(cityInputValue);
      let data = await fetchWeather(lat, lon);
      dislayWeather(data);
    } catch (error) {
      console.log(error);
      
    }
  }
});

async function fetchWeather(lat, lon) {
  try {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    let data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

function dislayWeather(data) {
  let iconCode = data.weather[0].icon;
  let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  weatherIcon.src = `${iconUrl}`;
  temperature.innerText = data.main.temp;
  cityName.innerText = data.name;
  humidityP.innerText = data.main.humidity + "%";
  windP.innerText = data.wind.speed + "Km/h";
}
