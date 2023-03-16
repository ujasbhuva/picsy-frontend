import request from "../utils/request";

export const freeLogin = ({
  browser_token,
  client_country,
  client_ip,
}: {
  browser_token: string;
  client_country: string;
  client_ip: string;
}): Promise<any> => {
  const data = {
    browser_token: browser_token,
    client_country: client_country,
    client_ip: client_ip,
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
