/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useEffect } from "react";

const api = axios.create({
  baseURL: "https://my-gym-509205781049.us-central1.run.app/api",
  headers: {
    "Content-Type": "application/json",
    "Allow-Control-Allow-Origin": "*",
  },
});

export const useAxiosInterceptor = (session: any) => {
  useEffect(() => {
    const requestIntercept = api.interceptors.request.use((config) => {
      if (!config.headers["Authorization"] && session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestIntercept);
    };
  }, [session]);

  return api;
};

export default api;
