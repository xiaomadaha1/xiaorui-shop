// pages/api/login.tsx
import Boom from "@hapi/boom";
import { apiHandler, prisma } from "@/utils/utils.server";
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { Secret } from 'jsonwebtoken'
import cookie from 'cookie'
async function validate(username: string, password: string) {
  // validate the username and password
  const user = await prisma.user.findUnique({
    where: {
      USERNAME: username,
    },

  });
  if (!user) {
    throw Boom.unauthorized("user not found");
  }
  if (bcrypt.compareSync(password, user.PWD)) {
    return user
  } else {
    throw Boom.unauthorized('username or password not correct')
  }
}
export default apiHandler()
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
     const body = req.body as {
       username: string;
       password: string;
     };
      const user = await validate(body.username, body.password)
      
      const token = jwt.sign({
          username: user.USERNAME
      }, process.env.JWT_SECRET as Secret, { expiresIn: '3 days' })
      
      //保存在httpOnly，之后所有请求都会带上这个cookie——token
      res.setHeader("Set-Cookie", cookie.serialize('token', token, {
              httpOnly: true,
              path: '/',
              maxAge: 60 * 60 * 24 * 3
            }));
    res.json({})
  })