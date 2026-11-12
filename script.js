
async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const result = document.getElementById("weatherResult");

    if (city === "") {
        result.textContent = "Please enter a city name!";
        return;
    }

    result.textContent = "Loading weather information...";

    try {
        // Find the city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            result.textContent = "City not found. Please try another city.";
            return;
        }

        const place = geoData.results[0];

        // Get weather using latitude and longitude
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather information.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        const weatherConditions = {
            0: "Clear Sky ☀️",
            1: "Mainly Clear 🌤️",
            2: "Partly Cloudy ⛅",
            3: "Cloudy ☁️",
            45: "Foggy 🌫️",
            48: "Foggy 🌫️",
            51: "Light Drizzle 🌦️",
            61: "Rainy 🌧️",
            63: "Moderate Rain 🌧️",
            65: "Heavy Rain 🌧️",
            71: "Snowfall ❄️",
            80: "Rain Showers 🌦️",
            95: "Thunderstorm ⛈️"
        };

        const condition =
            weatherConditions[current.weather_code] || "Variable Weather";

        result.innerHTML = `
            <h2 id="cityTitle"></h2>
            <p id="condition"></p>
            <p>🌡️ Temperature: ${current.temperature_2m} °C</p>
            <p>🤗 Feels Like: ${current.apparent_temperature} °C</p>
            <p>💧 Humidity: ${current.relative_humidity_2m}%</p>
            <p>💨 Wind Speed: ${current.wind_speed_10m} km/h</p>
        `;

        document.getElementById("cityTitle").textContent =
            `${place.name}, ${place.country}`;

        document.getElementById("condition").textContent = condition;

    } catch (error) {
        result.textContent =
            "Something went wrong. Please check your internet connection and try again.";
    }
}
