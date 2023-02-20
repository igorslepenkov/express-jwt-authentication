import { InternalAxiosRequestConfig } from "axios";
import { refreshSession, store } from "../store";
import { isJWTExpired, TokenExpiredError } from "./isJWTExpired";

export const accessInterseptor = async (
  config: InternalAxiosRequestConfig<any>
): Promise<InternalAxiosRequestConfig<any>> => {
  try {
    const {
      sessions: { session },
    } = store.getState();

    if (session) {
      const accessToken = session.access;

      if (isJWTExpired(accessToken)) {
        throw new TokenExpiredError();
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  } catch (err: any) {
    if (err instanceof TokenExpiredError) {
      const result = await store.dispatch(refreshSession());

      if (result.meta.requestStatus === "fulfilled") {
        const {
          sessions: { session },
        } = store.getState();

        if (session) {
          const { access: accessToken } = session;

          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    }

    return config;
  }
};
