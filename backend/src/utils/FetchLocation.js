

const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: { address, key: process.env.GOOGLE_MAPS_API_KEY },
        }
      );
      const { lat, lng } = response.data.results[0].geometry.location;
      return { type: "Point", coordinates: [lng, lat] }; // GeoJSON format
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };