import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

async function getImages(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const endpoint =
      req.body && req.body?.type === "random" ? "search/random" : "search";
    const URL = process.env.NEXT_PUBLIC_API_URL + endpoint;
    const data = await axios.post(URL, req.body);
    let fetchImages = data.data.data ?? [];
    const images = fetchImages.map((ele: any) => {
      return {
        ...ele,
        content:
          ele && ele.content
            ? ele.content?.replace("- Upscaled by", "")
            : ele.content,
      };
    });
    res.send({
      images: images,
      total: data.data.total_results ?? 0,
      is_last: data.data.is_last,
    });
  } catch (error: any) {
    console.log(error);
    res
      .status(error?.response?.status ?? 500)
      .send({ detail: error.response?.data?.detail });
  }
}

export default getImages;
