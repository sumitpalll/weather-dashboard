import { useEffect, useState } from "react";
import useLocation from "../hooks/useLocation";
import { fetchWeather } from "../services/weatherService";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function Home() {
    const { location, error } = useLocation();
    const [weather, setWeather] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [unit, setUnit] = useState("C");
    const [zoom, setZoom] = useState(24);

    const visibleData = chartData.slice(0, zoom);

    const convertTemp = (temp) => {
        return unit === "C" ? temp : (temp * 9) / 5 + 32;
    };

    useEffect(() => {
        if (location.latitude && location.longitude) {
            fetchWeather(location.latitude, location.longitude)
                .then((data) => {
                    setWeather(data);

                    const hourlyData = data.hourly.time.map((time, index) => ({
                        time: time.slice(11, 16),
                        temperature: convertTemp(data.hourly.temperature_2m[index]),
                        humidity: data.hourly.relative_humidity_2m[index],
                        precipitation: data.hourly.precipitation[index],
                        wind: data.hourly.wind_speed_10m[index],
                        pm10: data.hourly.pm10[index],
                        pm25: data.hourly.pm2_5[index],
                    }));

                    setChartData(hourlyData);
                })
                .catch((err) => console.error(err));
        }
    }, [location]);

    const cardStyle = {
        padding: "10px",
        borderRadius: "10px",
        background: "#d4ddef",
        minWidth: "150px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    };

    return (
        <div style={{ padding: "20px", maxWidth: "100%" }}>
            <h1>Weather Dashboard 🌦️</h1>

            {error && <p>Error: {error}</p>}

            {!location.latitude ? (
                <p>Fetching location...</p>
            ) : !weather ? (
                <p>Fetching weather...</p>
            ) : (
                <>
                    {/* Weather Cards */}
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <div style={{ marginBottom: "30px" }}>
                            <div style={cardStyle}>
                                <h3>🌡 Temperature ({unit === "C" ? "°C" : "°F"})</h3>
                                <p>{convertTemp(weather?.current?.temperature_2m)} ({unit === "C" ? "°C" : "°F"})</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <div style={cardStyle}>
                                <h3>💧 Humidity</h3>
                                <p>{weather.current.relative_humidity_2m} %</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <div style={cardStyle}>
                                <h3>🌬 Wind Speed</h3>
                                <p>{weather.current.wind_speed_10m} km/h</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setUnit(unit === "C" ? "F" : "C")} style={{ background: "#d6f1c2" }}>
                        Switch to {unit === "C" ? "°F" : "°C"}
                    </button>


                    <h2>Daily Highlights 🌤️</h2>

                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <div style={{ marginBottom: "30px" }}>
                            <div style={cardStyle}>
                                <h4>Min Temp:</h4>
                                <p> {convertTemp(weather?.daily?.temperature_2m_min?.[0])}°{unit}</p>
                                <h4>Max Temp:</h4>
                                <p> {convertTemp(weather?.daily?.temperature_2m_max?.[0])}°{unit}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <div style={cardStyle}>
                                <h4>Sunrise:</h4>
                                <p> {weather?.daily?.sunrise?.[0]?.slice(11, 16)}</p>
                                <h4>Sunset:</h4>
                                <p> {weather?.daily?.sunset?.[0]?.slice(11, 16)}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <div style={cardStyle}>
                                <h4>Max Wind Speed:</h4>
                                <p> {weather?.daily?.wind_speed_10m_max?.[0]} km/h</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <div style={cardStyle}>
                                <h4>Precipitation Probability Max:{" "}</h4>
                                <p>
                                    {weather?.daily?.precipitation_probability_max?.[0]}%
                                </p>
                            </div>
                        </div>

                    </div>

                    <button onClick={() => setUnit(unit === "C" ? "F" : "C")} style={{ background: "#d6f1c2", margin: "10px" }}>
                        Switch to {unit === "C" ? "°F" : "°C"}
                    </button>
                    <button onClick={() => setZoom(24)} style={{ background: "#d6f1c2", margin: "5px" }}>24h</button>
                    <button onClick={() => setZoom(12)} style={{ background: "#d6f1c2", margin: "5px" }}>12h</button>
                    <button onClick={() => setZoom(6)} style={{ background: "#d6f1c2", margin: "5px" }}>6h</button>
                    {/* Temperature Graph */}
                    <h2>Hourly Temperature 📊</h2>
                    <div style={{ overflowX: "auto" }}>
                        <div style={{ width: "1200px" }}>
                            <ResponsiveContainer width="100%" height={250} style={{ background: "#e8edd3" }}>
                                <LineChart data={visibleData}>
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="temperature" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <h2>Humidity 📊</h2>
                    <div style={{ overflowX: "auto" }}>
                        <div style={{ width: "1200px" }}>
                            <ResponsiveContainer width="100%" height={250} style={{ background: "#e8edd3" }} >
                                <LineChart data={visibleData}>
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="humidity" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <h2>Precipitation 🌧️</h2>
                    <div style={{ overflowX: "auto" }}>
                        <div style={{ width: "1200px" }}>
                            <ResponsiveContainer width="100%" height={250} style={{ background: "#e8edd3" }} >
                                <LineChart data={visibleData}>
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="precipitation" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <h2>Wind Speed 🌬️</h2>
                    <div style={{ overflowX: "auto" }}>
                        <div style={{ width: "1200px" }}>
                            <ResponsiveContainer width="100%" height={250} style={{ background: "#e8edd3" }} >
                                <LineChart data={visibleData}>
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="wind" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {chartData.some(d => d.pm10 || d.pm25) ? (
                        <>
                            <h2>Air Quality 🌫️</h2>
                            <ResponsiveContainer width="100%" height={250} style={{ background: "#e8edd3" }}>
                                <LineChart data={chartData}>
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="pm10" />
                                    <Line type="monotone" dataKey="pm25" />
                                </LineChart>
                            </ResponsiveContainer>
                        </>
                    ) : (
                        <h3>Air Quality data not available for this location</h3>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;