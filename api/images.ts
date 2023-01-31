import axios from "axios";

export const getImagesThroughNextAPI = (data?: {
  searchText?: string;
  offset?: number;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    axios({
      url: "/api/get-images",
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