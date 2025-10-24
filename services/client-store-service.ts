import axios from "axios";
import { API_BASE_URL } from "../config/api.config";
import { ClientStore } from "../models/client-store-model";

/**
 * Service for managing Stores.
 * Provides methods to create, update, fetch, delete stores,
 * and retrieve store-related data such as currency.
 */
export const clientStoreService = {
  /**
   * Get basic store data by store slug.
   *
   * @param slug The slug of the store
   * @returns Promise resolving to ClientStore
   */
  async getBySlug(slug: string): Promise<ClientStore> {
    const { data } = await axios.get(
      `${API_BASE_URL}/client/stores/by-slug/${slug}`
    );
    return data;
  },
};
