/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-15 22:41:07
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-16 14:08:10
 */
import { prisma } from "../../../utils/utils.server";
import { NextApiRequest, NextApiResponse } from "next/types";

// export const prisma = global.prisma || new PrismaClient()
// if (process.env.NODE_ENV !== "production") global.prisma = prisma
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await prisma.user.findMany()
    res.json({
      users
    })
  }