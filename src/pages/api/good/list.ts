/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-15 22:41:07
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-18 22:39:18
 */
import { apiHandler, prisma } from "../../../utils/utils.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default apiHandler().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const list = await prisma.goods.findMany()
    res.json({
      list
    })
}) 