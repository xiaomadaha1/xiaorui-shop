/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-19 00:02:35
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-19 00:19:15
 */
import { apiHandler, prisma } from "../../../utils/utils.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default apiHandler().post(async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body as {
        id: string,
      }
    const detail = await prisma.goodDetail.findMany({
        where: {
            id: body.id
        }
  })
    res.json({
      detail
    })
}) 