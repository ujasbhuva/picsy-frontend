import axios from "axios";
import { setToken } from "../utils/auth";

export enum SignInWith {
  SIGN_WITH_GOOGLE = "google.com",
  PASSWORD_LESS = "password_less",
  SIGN_WITH_PASSWORD = "password",
}

export interface UserSecure {
  id: string;
  email: string;
  is_new_user: boolean;
  token: string;
  email_verified: boolean;
}

export const sessionLoginThroughNextAPI = (data: {
  idToken?: string;
  signInWith: SignInWith;
}): Promise<UserSecure> => {
  return new Promise((resolve, reject) => {
    axios({
      url: `/api/auth-login`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const sessionLogin = ({
  idToken,
  signInWith,
}: {
  idToken?: string;
  signInWith: SignInWith;
}): Promise<UserSecure> => {
  return new Promise((resolve, reject) => {
    try {
      sessionLoginThroughNextAPI({
        idToken,
        signInWith,
      })
        .then((data) => {
          setToken(data.token);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};
