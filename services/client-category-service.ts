import { getAxiosInstance } from "@/config/axios-utils";
import { API_BASE_URL } from "../config/api.config";
import { ClientCategory } from "../models/client-category-model";

export const clientCategoryService = {
  /**
   * Get all categories for storefront.
   *
   * @returns Array of ClientCategory
   */
  async getAll(): Promise<ClientCategory[]> {
    const { data } = await getAxiosInstance().get(
      `${API_BASE_URL}/client/categories`
    );
    return data;
  },

  /**
   * Get a specific category by ID for storefront.
   *
   * @param id - Category UUID
   * @returns ClientCategory
   */
  async getById(id: string): Promise<ClientCategory> {
    const { data } = await getAxiosInstance().get(
      `${API_BASE_URL}/client/categories/${id}`
    );
    return data;
  },
};
