import { apiHandler, prisma } from "../../../utils/utils.server";
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";


export default apiHandler().post(async (req: NextApiRequest, res: NextApiResponse) => {
  
    const body = req.body as {
      username: string,
      goodIds: string
    }
    const created = await prisma.shopCart.create({
      data: {
        // id: '4',
        username: body.username,
        goodIds: body.goodIds
      }
    })
    res.json({
      message: 'success'
    })
  })