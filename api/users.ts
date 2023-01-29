import request from "../utils/request";

export interface UserInfo {
  id: string;
  browser_token: string;
  balance: number;
  histories: any[];
}

export const getUserDetails = ({
  browser_token,
}: {
  browser_token: string;
}): Promise<any> => {
  const data = {
    browser_token: browser_token,
  };
  return new Promise((resolve, reject) => {
    request({
      url: "user/details",
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
