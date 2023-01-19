/*
 * @Descripttion:
 * @version:
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-15 01:33:00
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-18 22:44:26
 */
import { getUserFromReq } from "@/utils/utils.server";
import { message } from "antd";
import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import styles from "../login/login.module.css";

export default function Index() {
  const username = useRef(null);
  const password = useRef(null);
  const loginMutation = useMutation(login);

  async function login({ username, password }) {
    const res = await axios.post("api/user/login", {
      username,
      password,
    });
    if (res.status === 200) message.success(`登录成功`);
    location.href = "/index";
  }
  function onClickLogin() {
    const usernameValue = username.current?.value;
    const passwordValue = password.current?.value;
    loginMutation.mutate({ username: usernameValue, password: passwordValue });
  }
  return (
    <>
      <style global jsx>{`
        body {
          margin: 0;
          padding: 0;
          min-width: 1200px;
        }
        input {
          outline: none;
        }
        html {
          font-family: "微软雅黑", Arial, sans-serif;
        }
        body,
        div,
        dl,
        dt,
        dd,
        ul,
        ol,
        li,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        form,
        fieldset,
        input,
        button,
        textarea,
        p,
        th,
        td,
        b,
        i,
        strong {
          padding: 0;
          margin: 0;
          font-family: Microsoft YaHei, sans-serif, Arial;
        }
        strong,
        b {
          font-weight: normal;
        }
        fieldset,
        img {
          border: 0;
        }
        a {
          text-decoration: none;
          color: #000;
          outline: none;
        }
        li {
          list-style: none;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-size: 100%;
          font-weight: normal;
        }
        input,
        button,
        textarea,
        select,
        optgroup,
        option {
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
        }
        input,
        button,
        textarea,
        select {
          *font-size: 100%;
        }
        span {
          cursor: pointer;
        }
      `}</style>
      <div className={styles["jb_shopping_top"]}>
        <div className={styles["jb_shopping_topa"]}>
          <div className={styles["jb_shopping_topb"]}>
            hi,欢迎您的到来！
            <a href="">登录</a> |<a href="/register">注册</a> |
            <a href="会员中心主页.html">会员中心</a> |<a href="">客服服务</a>
          </div>
        </div>
      </div>
      <div className={styles["jb_shopping_logo"]}>
        <img src="images/order_a.jpg" height="82" width="83" alt="" />
      </div>
      <div className={styles["jb_login"]}>
        <div className={styles["jb_log_lt"]}>
          <img src="images/jb_yyzx.jpg" alt="预约" />
        </div>
        <div className={styles["jb_log_rt"]}>
          <div className={styles["jb_lg_top"]}>
            <span>登录</span>
            <p>
              <a href="/register" className={styles["jb_lg_toplg"]}>
                注册新账号
              </a>
            </p>
            {loginMutation.error && (
              <div style={{ color: "red" }}>
                {loginMutation.error.response.data.message}
              </div>
            )}
            <div className={styles["jb_lg_int"]}>
              <input ref={username} type="text" id="jb_text" />
            </div>
            <div className={styles["jb_lg_inb"]}>
              <input ref={password} type="password" id="jb_password" />
            </div>
            <span className={styles["jb_lg_tpicon"]}></span>
            <span className={styles["jb_lg_tpicona"]}></span>
            <span className={styles["jb_lg_tpiconb"]}></span>
            <div className={styles["jb_lg_zddl"]}>
              <input type="checkbox" className={styles["jb_lg_check"]} />
              <h1 className={styles["jb_log_zd"]}>自动登录</h1>
              <h1 className={styles["jb_log_zda"]}>忘记密码？</h1>
            </div>
            <button
              className={styles["jb_lg_btn"]}
              id="jb_btn"
              onClick={onClickLogin}
            >
              登录
            </button>
          </div>
          <div className={styles["jb_zh_dl"]}>
            <span
              style={{ marginLeft: 15 }}
              className={styles["jb_zh_xxk"]}
            ></span>
            <span className={styles["jb_sy_wz"]}>使用合作网站账号登录</span>
            <span className={styles["jb_zh_xxk"]}></span>
          </div>
          <div className={styles["jb_zh_dlicon"]}>
            <span className={styles["jb_lg_tpiconc"]}></span>
            <span className={styles["jb_lg_tpicond"]}></span>
            <span className={styles["jb_lg_tpicone"]}></span>
            <span className={styles["jb_lg_tpiconf"]}></span>
            <span className={styles["jb_lg_tpicong"]}></span>
            <span className={styles["jb_lg_tpiconh"]}></span>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getUserFromReq(ctx.req);
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/index",
      },
    };
  }
  return {
    props: {},
  };
};
