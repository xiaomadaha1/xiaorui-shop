/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-15 22:41:07
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-19 14:18:53
 */
import { apiHandler, prisma } from "../../../utils/utils.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default apiHandler().post(async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body as {
        username: string,
    }
    console.log(body.username)
    const list = await prisma.shopCart.findMany({
        where: {
          username: body.username
      }
  })
    res.json({
      list
    })
}) 