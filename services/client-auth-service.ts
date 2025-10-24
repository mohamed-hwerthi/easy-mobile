import { API_BASE_URL } from "@/config/api.config";
import axios from "axios";

export interface ClientSignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ClientSignInData {
  email: string;
  password: string;
}

export interface ClientAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export const clientAuthService = {
  // Client Registration
  async signUp(userData: ClientSignUpData): Promise<ClientAuthResponse> {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/client/sign-up`,
      userData,
      { withCredentials: true }
    );
    return data;
  },

  // Client Login
  async signIn(credentials: ClientSignInData): Promise<ClientAuthResponse> {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/client/sign-in`,
      credentials,
      { withCredentials: true }
    );
    return data;
  },

  // Logout
  async logout(): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/auth/client/logout`,
      {},
      { withCredentials: true }
    );
  },

  // Get Current Client User
  async getCurrentUser(): Promise<ClientAuthResponse["user"]> {
    const { data } = await axios.get(`${API_BASE_URL}/auth/client/current`, {
      withCredentials: true,
    });
    return data;
  },

  // Update Profile
  async updateProfile(
    userId: string,
    updates: Partial<ClientSignUpData>
  ): Promise<ClientAuthResponse["user"]> {
    const { data } = await axios.put(
      `${API_BASE_URL}/auth/client/profile/${userId}`,
      updates,
      { withCredentials: true }
    );
    return data;
  },
};
