import { useState, useEffect } from "react";

function useLocation() {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (err) => {
                setError(err.message);
            }
        );
    }, []);

    return { location, error };
}

export default useLocation;