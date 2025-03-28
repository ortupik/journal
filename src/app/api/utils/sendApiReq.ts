import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios";
import { root } from "./endPoints";

type SendApiReqParams = AxiosRequestConfig & {
  isAuthenticated?: boolean;
};

type CustomError = Error & { status?: number };

const requestInterceptor = (
  instance: AxiosInstance,
  isAuthenticated: boolean,
  headers: Record<string, string> | undefined
): void => {
  instance.interceptors.request.use(
    (config) => {
      if (isAuthenticated) {
        config.headers = new AxiosHeaders({
          // Authorization - handled by next-auth
          // Authorization: "Bearer " + jsCookie.get("next-auth.session-token"),
          ...headers,
        });
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

const responseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    (error) => {
      const err: CustomError = new Error(error?.message);
      err.status = error?.response?.status;
      err.message = error?.response?.data?.message || "An error occurred";
      throw err;
    }
  );
};

const sendApiReq = <T>({ isAuthenticated = true, headers = {}, ...others }: SendApiReqParams): Promise<T> => {
  const instance = axios.create({ baseURL: root.baseUrl });
  requestInterceptor(instance, isAuthenticated, headers as Record<string, string>);
  responseInterceptor(instance);
  return instance({ ...others });
};


export default sendApiReq;
