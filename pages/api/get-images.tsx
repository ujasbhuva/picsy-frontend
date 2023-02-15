import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

async function getImages(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const URL = process.env.NEXT_PUBLIC_API_URL + "search";
    const data = await axios.post(URL,req.body);    
    let fetchImages = data.data.data ?? [];
    const images = fetchImages.map((data: any)=>{return {...data}})
    res.send({ images: images, total: data.data.total_results ?? 0 });
  } catch (error: any) {
    res
      .status(error?.response?.status ?? 500)
      .send({ detail: error.response?.data?.detail });
  }
}

export default getImages;
