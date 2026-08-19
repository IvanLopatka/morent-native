import { CarFilters } from "./filter-utils";
import { supabase } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export interface Car {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  gallery?: string[] | null;
  price: string;
  seats: string;
  spending: string;
  description: string;
  availableFrom?: string;
  availableTo?: string;
  availableFromTime?: string;
  availableToTime?: string;
}

const BUCKET_NAME = 'car-photos';

export const CarService = {
  getPhotoUrl(path: string, folder: string = '') {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return path;

    let finalPath = path;
    if (folder && !path.startsWith(`${folder}/`)) {
      finalPath = `${folder}/${path}`;
    }

    const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://plxsgjaqcvxlkbodfqbx.supabase.co';
    return `${baseUrl}/storage/v1/object/public/${BUCKET_NAME}/${finalPath}`;
  },

  async getAllCars(filters?: Partial<CarFilters> & { pickUpLocation?: string }, client?: SupabaseClient): Promise<Car[]> {
    const activeClient = client || supabase;
    let query = activeClient
      .from('cars')
      .select('*')
      .not('thumbnail', 'like', '/%');

    if (filters) {
      if (filters.pickUpLocation) {
        query = query.eq('location', filters.pickUpLocation);
      }

      const activeTypes = filters.types?.filter(Boolean) || [];
      if (activeTypes.length > 0) {
        const mappedTypes = activeTypes.map((t) => (t === "Sportscar" ? "Sport" : t));
        query = query.in('type', mappedTypes);
      }

      const activeCapacities = filters.capacities?.filter(Boolean) || [];
      if (activeCapacities.length > 0) {
        const exactValues = activeCapacities.filter((c) => c !== "8");
        if (activeCapacities.includes("8")) {
          const seatsGte8 = Array.from({ length: 20 }, (_, i) => (i + 8).toString());
          query = query.or(`seats.in.(${[...exactValues, ...seatsGte8].join(",")})`);
        } else {
          query = query.in('seats', exactValues);
        }
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.pickUpDate && filters.dropOffDate) {
        query = query
          .gte('available_to', filters.dropOffDate)
          .lte('available_from', filters.pickUpDate);
      }

      if (filters.pickUpTime) {
        query = query
          .lte('available_from_time', filters.pickUpTime)
          .gte('available_to_time', filters.pickUpTime);
      }

      if (filters.dropOffTime) {
        query = query
          .lte('available_from_time', filters.dropOffTime)
          .gte('available_to_time', filters.dropOffTime);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters.pickUpDate) {
        query = query
          .order('available_from', { ascending: true })
          .order('available_from_time', { ascending: true });
      }
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching cars:', error);
      return [];
    }

    return data.map((car: any) => ({
      ...car,
      thumbnail: this.getPhotoUrl(car.thumbnail || car.image, 'thumbnails'),
      gallery: (car.gallery || []).map((path: string) => this.getPhotoUrl(path, 'galleries')),
      spending: car.fuel_capacity || car.spending,
      price: car.price.toString(),
      availableFrom: car.available_from || car.availableFrom,
      availableTo: car.available_to || car.availableTo,
      availableFromTime: car.available_from_time || car.availableFromTime,
      availableToTime: car.available_to_time || car.availableToTime,
    }));
  },

  async getCarById(id: string, client?: SupabaseClient): Promise<Car | null> {
    const activeClient = client || supabase;
    const { data, error } = await activeClient
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      thumbnail: this.getPhotoUrl(data.thumbnail || data.image, 'thumbnails'),
      gallery: (data.gallery || []).map((path: string) => this.getPhotoUrl(path, 'galleries')),
      spending: data.fuel_capacity || data.spending,
      price: data.price.toString(),
      availableFrom: data.available_from || data.availableFrom,
      availableTo: data.available_to || data.availableTo,
      availableFromTime: data.available_from_time || data.availableFromTime,
      availableToTime: data.available_to_time || data.availableToTime,
    };
  },

  async isCarSaved(carId: string, userId: string, client?: SupabaseClient): Promise<boolean> {
    const activeClient = client || supabase;
    const { data, error } = await activeClient
      .from('saved_cars')
      .select('id')
      .eq('user_id', userId)
      .eq('car_id', carId)
      .single();

    return !!data && !error;
  },

  async toggleSaveCar(carId: string, userId: string, client?: SupabaseClient): Promise<{ saved: boolean }> {
    const activeClient = client || supabase;
    const isSaved = await this.isCarSaved(carId, userId, activeClient);

    if (isSaved) {
      await activeClient
        .from('saved_cars')
        .delete()
        .eq('user_id', userId)
        .eq('car_id', carId);
      return { saved: false };
    } else {
      await activeClient
        .from('saved_cars')
        .insert({ user_id: userId, car_id: carId });
      return { saved: true };
    }
  },

  async getSavedCars(userId: string, client?: SupabaseClient): Promise<Car[]> {
    const activeClient = client || supabase;
    const { data, error } = await activeClient
      .from('saved_cars')
      .select('car_id, cars(*)')
      .eq('user_id', userId);

    if (error || !data) return [];

    return data
      .filter((item: any) => item.cars !== null)
      .map((item: any) => {
        const car = item.cars;
        return {
          ...car,
          thumbnail: this.getPhotoUrl(car.thumbnail || car.image, 'thumbnails'),
          gallery: (car.gallery || []).map((path: string) => this.getPhotoUrl(path, 'galleries')),
          spending: car.fuel_capacity || car.spending,
          price: car.price ? car.price.toString() : "0",
          availableFrom: car.available_from || car.availableFrom,
          availableTo: car.available_to || car.availableTo,
          availableFromTime: car.available_from_time || car.availableFromTime,
          availableToTime: car.available_to_time || car.availableToTime,
        };
      });
  }
};
