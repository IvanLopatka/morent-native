export const getCities = async (): Promise<string[]> => {
  try {
    const response = await fetch("https://secure.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&maxRows=50&username=vanish13");
    if (!response.ok) {
      throw new Error(`Failed to fetch from GeoNames: ${response.statusText}`);
    }
    const data = await response.json();
    return data.geonames?.map((city: { name: string }) => city.name) || [];
  } catch (error) {
    console.error("Error in getCities:", error);
    // Fallback static list of cities if external service fails
    return ["New York", "London", "Paris", "Tokyo", "Berlin", "Rome", "Madrid"];
  }
};
