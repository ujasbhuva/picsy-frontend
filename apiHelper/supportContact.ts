import request from "../utils/request";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const supportContactCreate = (data: {
  email: string;
  name: string;
  message: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: baseURL + "support-contact",
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
