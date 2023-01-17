/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-16 13:52:21
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-16 23:36:54
 */
import nc from "next-connect";
import * as Boom from "@hapi/boom";
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";

// @ts-expect-error
export const prisma: PrismaClient = global.prisma || new PrismaClient();
// @ts-expect-error
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export const apiHandler = () =>
  nc<NextApiRequest, NextApiResponse>({
    onError(err, req, res) {
      if (Boom.isBoom(err)) {
        console.log(err);
        res.status(err.output.payload.statusCode);
        res.json({
          error: err.output.payload.error,
          message: err.output.payload.message,
        });
      } else {
        res.status(500);
        res.json({
          message: "Unexpected error",
        });
        console.error(err);
        // unexcepted error
      }
    },
  });

export const getUserFromReq = async (req: NextApiRequest) => {
  const token = req.cookies['token']
  if (!token) return null
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as Secret)
    if((typeof(payload) === 'string'))return null 
    const user = await prisma.user.findUnique({
      where: {
        USERNAME: payload.username
      }
    })
    return user
  }
  catch (e) {
    return null
  }
  }
