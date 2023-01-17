/*
 * @Descripttion:
 * @version:
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-16 14:45:30
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-16 14:45:42
 */
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Component } from "react";

const inter = Inter({ subsets: ["latin"] });
export const queryClient = new QueryClient();
export default function Home({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
