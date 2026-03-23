const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchWeather = async (latitude, longitude) => {
    const response = await fetch(
        `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max,precipitation_probability_max&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,pm10,pm2_5&timezone=auto`
    );

    if (!response.ok) throw new Error("Failed to fetch weather");

    return response.json();
};

export const fetchHistoricalWeather = async (latitude, longitude, start, end) => {
    const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max&timezone=auto`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch historical data");
    }

    return response.json();
};