import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

async function userInfoRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const { searchText, offset } = await req.body;
  let pageOffset = offset ? `&offset=${offset}` : "";
  try {
    const data = await axios.get(
      `https://discord.com/api/v9/guilds/662267976984297473/messages/search?content=${searchText}${pageOffset}`,
      {
        headers: {
          accept: "*/*",
          authorization:
            process.env.NEXT_PUBLIC_AUTH_TOKEN,
        },
      }
    );
    let fetchImages = data.data.messages ?? [];
      let arr: any[] = [];
      fetchImages.forEach((data: any) => {
        if (data.length > 0) {
          data.forEach((ele: any) => {
            if (ele.attachments.length > 0) {
              ele.attachments.forEach((item: any) => {
                arr.push({ ...item, content: ele?.content });
              });
            }
          });
        }
      });
    res.send({images : arr, total : data.data.total_results ?? 0});
  } catch (error: any) {
    res
      .status(error?.response?.status ?? 500)
      .send({ detail: error.response?.data?.detail });
  }
}

export default userInfoRoute;
