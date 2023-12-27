import request from "../utils/request";

export const getConfigs = () => {
  return new Promise((resolve, reject) => {
    request({
      url: `/admin/get-splash-screen`,
      method: "get"
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
