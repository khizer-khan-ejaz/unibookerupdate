export const API_BASE_URL = "https://vehicle.unibooker.app/api/v1/";

import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getUserLocation = (): Promise<{ latitude: string; longitude: string }> =>
  new Promise((resolve) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        () => {
          resolve({ latitude: "", longitude: "" });
        }
      );
    } else {
      resolve({ latitude: "", longitude: "" });
    }
  });

const getSystemTimezone = (): string => {
  const timeZoneOffset = new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(timeZoneOffset) / 60);
  const minutes = Math.abs(timeZoneOffset) % 60;
  const sign = timeZoneOffset <= 0 ? "+" : "-";
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

api.interceptors.request.use(
  async (config) => {
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : {};
    const token = (userData.token as string) || (userData.accessToken as string) || "";
    const location = await getUserLocation();
    const timeZone = getSystemTimezone();

    const defaultParams = {
      module_id: "2",
      latitude: location.latitude,
      longitude: location.longitude,
      time_zone: timeZone,
      token: token
    };

    const excludedEndpoints = ["/getgeneralSettings"];
    const isExcludedEndpoint = excludedEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!isExcludedEndpoint) {
      if (config.method === "get") {
        config.params = { ...defaultParams, ...config.params };
      } else {
        config.data = { ...defaultParams, ...config.data };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;