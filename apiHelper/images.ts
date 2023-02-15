import axios from "axios";

export interface iImage {
  size: number;
  proxy_url: string;
  url: string;
  width: number;
  height: number;
  upscaled: boolean;
}

export interface iImagePayload {
  id: number;
  content: string;
  images: iImage[];
}

export const getImagesThroughNextAPI = (data?: {
  query?: string;
  search_after?: string;
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
