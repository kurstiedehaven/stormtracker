document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const cityInput = document.getElementById("cityInput");
    const currentInfo = document.getElementById("currentInfo");
    const forecastInfo = document.getElementById("forecastInfo");
    const recentSearchesContainer = document.getElementById("recentSearches");
    const apiKey = "6e511f1b761849d9639f41a927677cf6";

    // Function to display recent searches
    function displayRecentSearches(searches) {
        recentSearchesContainer.innerHTML = "";
        searches.forEach(search => {
            const button = document.createElement("button");
            button.textContent = search;
            button.addEventListener("click", () => {
                handleSearch(search);
            });
            recentSearchesContainer.appendChild(button);
        });
    }

    // Function to save recent search to local storage
    function saveRecentSearch(search) {
        let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        if (!searches.includes(search)) {
            searches.unshift(search);
            localStorage.setItem("recentSearches", JSON.stringify(searches));
            displayRecentSearches(searches);
        }
    }

    // Load recent searches from local storage on page load
    displayRecentSearches(JSON.parse(localStorage.getItem("recentSearches")) || []);

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

        // Save search to recent searches
        saveRecentSearch(cityName);
    }

    function displayCurrentWeather(data) {
        const tempInFahrenheit = (data.main.temp * 9 / 5) + 32;
        currentInfo.innerHTML = `
            <div>
                <p>City: ${data.name}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>Temperature: ${tempInFahrenheit.toFixed(1)}°F</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed}m/s</p>
            </div>
        `;
    }

    function displayForecast(data) {
        forecastInfo.innerHTML = "";
        for (let i = 0; i < data.list.length; i += 8) { // Display one forecast per day
            const forecast = data.list[i];
            const tempInFahrenheit = (forecast.main.temp * 9 / 5) + 32;
            forecastInfo.innerHTML += `
                <div>
                    <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                    <p>Temperature: ${tempInFahrenheit.toFixed(1)}°F</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed}m/s</p>
                </div>
            `;
        }
    }
});
