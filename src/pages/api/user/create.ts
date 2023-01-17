/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-15 22:41:07
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-16 14:40:34
 */
import { apiHandler, prisma } from "../../../utils/utils.server";
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";
export default apiHandler().post(async (req: NextApiRequest,  res: NextApiResponse) => {
    const body = req.body as {
      username: string,
      password: string
    }
    const created = await prisma.user.create({
      data: {
        USERNAME: body.username,
        PWD: bcrypt.hashSync(body.password, 10)
      }
    })
    res.json({
      message: 'success'
    })
  })