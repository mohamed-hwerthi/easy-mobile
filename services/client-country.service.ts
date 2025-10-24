import axios from "axios";
import { API_BASE_URL } from "../config/api.config";
import { ClientCountry } from "../models/client-country.model";

export const clientCountryService = {
  /**
   * Get all countries.
   * @returns Array of Country.
   */
  async getAll(): Promise<ClientCountry[]> {
    const { data } = await axios.get(`${API_BASE_URL}/client/countries`);
    return data;
  },
};
