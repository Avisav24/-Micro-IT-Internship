let weather = {
  apiKey: "01d9f2d66b5fb9c863aa86b5cb001cd2",
  fetchWeather: async function (city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      );
      if (!response.ok) {
        throw new Error("No weather found.");
      }
      const data = await response.json();
      this.displayWeather(data);
    } catch (error) {
      alert(error.message);
    }
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    const weatherCard = document.querySelector(".weather");
    weatherCard.querySelector(".city").innerText = "Weather in " + name;
    weatherCard.querySelector(
      ".icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;
    weatherCard.querySelector(".description").innerText = description;
    weatherCard.querySelector(".temp").innerText = `${Math.round(temp)}°C`;
    weatherCard.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
    weatherCard.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
    weatherCard.classList.remove("loading");

    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;
  },

  search: function () {
    const searchBar = document.querySelector(".search-bar");
    const searchValue = searchBar.value.trim();
    if (searchValue) {
      this.fetchWeather(searchValue);
    }
  },
};

document.querySelector(".search button").addEventListener("click", () => {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    weather.search();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  weather.fetchWeather("New Delhi");
});
