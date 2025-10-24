const getBaseUrl = () => {
  if (__DEV__) {
    return "http://192.168.1.19:8080"; // ← Use this IP
  } else {
    return "https://your-production-domain.com";
  }
};

export const API_BASE_URL = `${getBaseUrl()}/api`;
export const API_UPLOADS_URL = `${getBaseUrl()}/`;
