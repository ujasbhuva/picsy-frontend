import { NextApiRequest, NextApiResponse } from "next";
import request from "../../utils/request";

async function sessionLoginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { idToken, signInWith } = await req.body;

  try {
    const data = {
      id_token: idToken,
    };
    const { data: userSecure } = await request({
      url: "/user/token",
      method: "post",
      data,
      params: {
        sign_in_with: signInWith,
        is_web: true
      },
    });
    res.send(userSecure);
  } catch (error: any) {
    console.log(error);
    res
      .status(error?.response?.status ?? 500)
      .send({ detail: error.response?.data?.detail });
  }
}

export default sessionLoginRoute;
