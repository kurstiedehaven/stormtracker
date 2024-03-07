document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const cityInput = document.getElementById("cityInput");
    const currentInfo = document.getElementById("currentInfo");
    const forecastInfo = document.getElementById("forecastInfo");
    const apiKey = "6e511f1b761849d9639f41a927677cf6";

    searchButton.addEventListener("click", () => {
        const cityName = cityInput.value.trim();
        if (cityName !== "") {
            handleSearch(cityName);
        }
    });

    async function fetchWeather(cityName) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching current weather data:", error);
        }
    }

    async function fetchForecast(cityName) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching forecast data:", error);
        }
    }

    async function handleSearch(cityName) {
        // Fetch current weather data
        const currentWeather = await fetchWeather(cityName);
        displayCurrentWeather(currentWeather);

        // Fetch 5-day forecast data
        const forecastData = await fetchForecast(cityName);
        displayForecast(forecastData);
    }

    function displayCurrentWeather(data) {
        currentInfo.innerHTML = `
            <div>
                <p>City: ${data.name}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>Temperature: ${data.main.temp}°F</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed}m/s</p>
            </div>
        `;
    }

    function displayForecast(data) {
        forecastInfo.innerHTML = "";
        for (let i = 0; i < data.list.length; i += 8) { // Display one forecast per day
            const forecast = data.list[i];
            forecastInfo.innerHTML += `
                <div>
                    <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                    <p>Temperature: ${forecast.main.temp}°F</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed}m/s</p>
                </div>
            `;
        }
    }
});
