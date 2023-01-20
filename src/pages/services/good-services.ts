/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-18 22:27:08
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-19 17:30:06
 */

import { base_URL } from "@/config/api-config";
import axios from "axios";

export async function addGoodsToCart(id: string, username: string) {
    return axios.post(`${base_URL}/api/good/add-cart`, {
        goodIds: id,
        username:username
    })
 }