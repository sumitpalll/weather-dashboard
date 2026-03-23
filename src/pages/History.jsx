import { useState, useEffect } from "react";
import useLocation from "../hooks/useLocation";
import { fetchHistoricalWeather } from "../services/weatherService";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function History() {
    const { location } = useLocation();
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("2024-01-01");
    const [endDate, setEndDate] = useState("2024-01-10");

    useEffect(() => {
        if (location.latitude && location.longitude) {
            fetchHistoricalWeather(
                location.latitude,
                location.longitude,
                startDate,
                endDate
            )
                .then((res) => {
                    const formatted = res.daily?.time?.map((date, i) => ({
                        date,
                        tempMax: res.daily.temperature_2m_max[i],
                        tempMin: res.daily.temperature_2m_min[i],
                        tempMean: res.daily.temperature_2m_mean[i],
                        precipitation: res.daily.precipitation_sum[i],
                        wind: res.daily.wind_speed_10m_max[i],
                    })) || [];

                    setData(formatted);
                })
                .catch((err) => console.error(err));
        }
    }, [location, startDate, endDate]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Historical Weather 📊</h1>

            {/* Date Inputs */}
            <div style={{ marginBottom: "20px" }}>
                <label>Start Date: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label style={{ marginLeft: "10px" }}>End Date: </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            {/* Temperature Graph */}
            <h2>Temperature Trends 🌡️</h2>
            <div style={{ overflowX: "auto" }}>
                <div style={{ width: "1200px" }}>
                    <ResponsiveContainer width="100%" height={300} style={{ background: "#d3e0a0" }} >
                        <LineChart data={data}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="tempMax" />
                            <Line dataKey="tempMin" />
                            <Line dataKey="tempMean" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Precipitation */}
            <h2>Precipitation 🌧️</h2>
            <div style={{ overflowX: "auto" }}>
                <div style={{ width: "1200px" }}>
                    <ResponsiveContainer width="100%" height={300} style={{ background: "#d3e0a0" }} >
                        <LineChart data={data}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="precipitation" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Wind */}
            <h2>Wind Speed 🌬️</h2>
            <div style={{ overflowX: "auto" }}>
                <div style={{ width: "1200px" }}>
                    <ResponsiveContainer width="100%" height={300} style={{ background: "#d3e0a0" }} >
                        <LineChart data={data}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="wind" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Air Quality */}
            {data.some(d => d.pm10 || d.pm25) ? (
                <>
                    <h2>Air Quality 🌫️</h2>
                    <div style={{ overflowX: "auto" }}>
                        <div style={{ width: "1200px" }}>
                            <ResponsiveContainer width="100%" height={250} style={{ background: "#d3e0a0" }} >
                                <LineChart data={data}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line dataKey="pm10" />
                                    <Line dataKey="pm25" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            ) : (
                <h3>Air Quality data not available for this location</h3>
            )}
        </div>
    );
}

export default History;