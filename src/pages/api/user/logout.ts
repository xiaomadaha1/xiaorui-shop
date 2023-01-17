/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-17 00:50:19
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-17 00:52:43
 */

import {apiHandler} from '../../../utils/utils.server'
import cookie from 'cookie'

export default apiHandler().get(async (req, res) => {
    res.setHeader('Set-Cookie', cookie.serialize('token', 'invalid', {
        httpOnly: true,
        path: '/'
    }))
    res.redirect('/login')
})