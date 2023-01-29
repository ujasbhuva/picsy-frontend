import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import Router from "next/router";
import { getToken } from "./auth";

export const authPages = ["/", "/login", "/signup", "/generated-content"];

let cancelTokenSource = axios.CancelToken.source();

export default function authRequest(
  options: AxiosRequestConfig,
  token?: string
): AxiosPromise<any> {
  token = token ?? getToken();
  if (!token) {
    Router.push("/login");
    return Promise.reject(new AxiosError("Invalid Token", "401"));
  }
  cancelTokenSource = axios.CancelToken.source();
  const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { Authorization: `Bearer ${token}` },
    cancelToken: cancelTokenSource.token,
  });
  return request(options);
}

export function cancelRequest() {
  cancelTokenSource.cancel();
}

export function isCanceled(err: any) {
  return axios.isCancel(err);
}
