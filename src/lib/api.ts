import { supabase } from "@/utils/supabase/client";

export const getCities = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('location')
      .not('thumbnail', 'like', '/%');

    if (error) {
      throw error;
    }

    if (!data) return [];

    // Extract unique locations, filter out null/empty values, and sort alphabetically
    const locations = Array.from(
      new Set(data.map((item: any) => item.location).filter(Boolean))
    ) as string[];

    locations.sort();
    return locations;
  } catch (error) {
    console.error("Error in getCities:", error);
    // Fallback static list of cities if external service or database fails
    return ["New York", "London", "Paris", "Tokyo", "Berlin", "Rome", "Madrid"];
  }
};
