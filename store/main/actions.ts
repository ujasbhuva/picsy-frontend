import { UserInfo } from "../../api/users";

export const SET_USER_INFO: string = "SET_USER_INFO";
export const SET_CREDIT: string = "SET_CREDIT";

export const setUserInfo = (data: UserInfo) => {
  return { type: SET_USER_INFO, payload: data };
};

export const setCredit = (credit: number | string) => {
  return { type: SET_CREDIT, payload: credit };
};

