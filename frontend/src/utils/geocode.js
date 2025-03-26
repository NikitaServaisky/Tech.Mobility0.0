import axios from "axios";

const API_KEY = import.meta.VITE_GRAPHHOPPER_API_KEY;

export const geocodeAddress = async (addres) => {
    const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(addres)}&limit=1&locate=he&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const result = response.data.hits[0];
        return {
            lat: result.point.lat,
            lon: result.point.lng,
        };
    } catch (err) {
        console.error('Geocoding error:', err);
        return null;
    }
};