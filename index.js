const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 80;
const ApiKey = "9e71e2a9a71345babd68a53e27637a16"; 

app.use(express.static("public"));

app.get("/weather", async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).send("Location is required");
        }

        // Convert location to lat/lon using OpenWeather Geo API
        const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${ApiKey}`);
        const { lat, lon } = geoResponse.data[0];

        // Fetch weather data using lat/lon
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`);
        
        // Send weather data as JSON response
        res.json({
            temp: Math.round(weatherResponse.data.main.temp),
            weather: weatherResponse.data.weather[0].main,
            description: weatherResponse.data.weather[0].description,
            city: weatherResponse.data.name,
            country: weatherResponse.data.sys.country,
            icon: weatherResponse.data.weather[0].icon,
        });
    } catch (error) {
        res.status(500).send("Error retrieving weather data");
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
