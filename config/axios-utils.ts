import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../config/api.config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const storeSlug = await AsyncStorage.getItem("storeSlug");

      if (storeSlug) {
        config.headers["X-Store-Slug"] = storeSlug;
      }
    } catch (error) {
      console.error(" Error getting store slug:", error);
    }
    return config;
  },
  (error) => {
    console.error(" Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const getAxiosInstance = () => {
  return axiosInstance;
};
