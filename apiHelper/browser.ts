import request from "../utils/request";

export const freeLogin = ({
  browser_token,
}: {
  browser_token: string;
}): Promise<any> => {
  const data = {
    browser_token: browser_token,
  };
  return new Promise((resolve, reject) => {
    request({
      url: "user/login",
      method: "post",
      data,
    })
      .then(({ data }) => {
        // setToken(data.data.token ?? "");
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
