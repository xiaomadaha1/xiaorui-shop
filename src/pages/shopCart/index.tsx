/*
 * @Descripttion:
 * @version:
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-15 00:42:26
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-20 16:40:47
 */
import React from "react";
import styles from "../shopCart/shopCart.module.css";
import Image from "next/image";
import { getUserFromReq } from "@/utils/utils.server";
import { GetServerSideProps } from "next";
import { base_URL } from "@/config/api-config";
import axios from "axios";
export default function Index(props) {
  const { detailList } = props;
  console.log(props);
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
      ;
      <div className={styles["jb_shopping_top"]}>
        <div className={styles["jb_shopping_topa"]}>
          <div className={styles["jb_shopping_topb"]}>
            hi,欢迎您的到来！
            <a href="登录.html">登录</a> |<a href="注册/注册.html">注册</a> |
            <a href="/api/user/logout">退出登录</a> |
            <a href="会员中心主页.html">会员中心</a> |<a href="">客服服务</a>
          </div>
        </div>
      </div>
      <div className={styles["jb_shopping_logo"]}>
        <Image
          src="/images/order_a.jpg"
          alt="Picture of the author"
          width={83}
          height={82}
        ></Image>
      </div>
      <div className={styles["jb_shopping_middle"]}>
        <div className={styles["jb_sp_top"]}>
          <img src="/images/shoping_a.jpg" alt="" />
          <span>我的购物车</span>
        </div>
        <div className={styles["jb_sop_tit"]}>
          <div className={styles["jb_sop_word"]}>
            <span className={styles["jb_sop_word_a"]}>商品</span>
            <span className={styles["jb_sop_word_b"]}>单价</span>
            <span className={styles["jb_sop_word_c"]}>优惠</span>
            <span className={styles["jb_sop_word_d"]}>数量(件)</span>
            <span className={styles["jb_sop_word_e"]}>重量(kg)</span>
            <span className={styles["jb_sop_word_f"]}>小计</span>
            <span className={styles["jb_sop_word_g"]}>操作</span>
          </div>
        </div>
        {/* <div className={styles["jb_sop_jst"]}>
          <input className={styles["jb_sop_jsta"]} type="checkbox" />
          <img
            className={styles["jb_sop_jstb"]}
            src="/images/shoping_b.jpg"
            height="67"
            width="41"
            alt=""
          />
          <span className={styles["jb_sop_jstc"]}>金龙鱼盘锦大米5kg</span>
          <p className={styles["jb_sop_jstd"]}>
            会员价：<span className={styles["jb_sop_jste"]}>￥38.50</span>
          </p>
          <span className={styles["jb_sop_jstf"]}>---</span>
          <div className={styles["jb_sop_jstga"]}>
            <span className={styles["jb_sop_jstgb"]}>-</span>
            <span className={styles["jb_sop_jstgc"]}>1</span>
            <span className={styles["jb_sop_jstgb"]}>+</span>
          </div>
          <span className={styles["jb_sop_jstgd"]}>5.0</span>
          <span className={styles["jb_sop_jstge"]}>￥38.5</span>
          <p className={styles["jb_sop_jstgf"]}>收藏</p>
          <p className={styles["jb_sop_jstgg"]}>删除</p>
        </div> */}
        {detailList?.length &&
          detailList.map((item) => {
            return (
              <div key={item.id}>
                <div className={styles["jb_sop_jst"]}>
                  <input className={styles["jb_sop_jsta"]} type="checkbox" />
                  <img
                    className={styles["jb_sop_jstb"]}
                    src={item.img}
                    height="67"
                    width="41"
                    alt=""
                  />
                  <span className={styles["jb_sop_jstc"]}>{item.name}</span>
                  <p className={styles["jb_sop_jstd"]}>
                    会员价：
                    <span className={styles["jb_sop_jste"]}>
                      ￥{(item.price * item.discount).toFixed(2)}
                    </span>
                  </p>
                  <span className={styles["jb_sop_jstf"]}>---</span>
                  <div className={styles["jb_sop_jstga"]}>
                    <span className={styles["jb_sop_jstgb"]}>-</span>
                    <span className={styles["jb_sop_jstgc"]}>1</span>
                    <span className={styles["jb_sop_jstgb"]}>+</span>
                  </div>
                  <span className={styles["jb_sop_jstgd"]}>1</span>
                  <span className={styles["jb_sop_jstge"]}>
                    ￥{(item.price * item.discount).toFixed(2)}
                  </span>
                  <p className={styles["jb_sop_jstgf"]}>收藏</p>
                  <p className={styles["jb_sop_jstgg"]}>删除</p>
                </div>
              </div>
            );
          })}

        <div className={styles["jb_all_qx"]}>
          <input className={styles["jb_all_qxa"]} type="checkbox" />
          <span className={styles["jb_all_qxb"]}>全选</span>
          <span className={styles["jb_all_qxc"]}>总计：</span>
          <span className={styles["jb_all_qxd"]}>1件</span>
          <span className={styles["jb_all_qxe"]}>5.0kg</span>
          <span className={styles["jb_all_qxf"]}>￥38.5</span>
        </div>
        <div className={styles["jb_payment"]}>
          <span className={styles["jb_paymenta"]}>应付金额(不含运费)：</span>
          <span className={styles["jb_paymentb"]}>￥38.50</span>
        </div>
        <div className={styles["jb_conshop"]}>
          <button className={styles["jb_conshop_lt"]} id="btn">
            <img
              className={styles["jb_conshop_lta"]}
              src="/images/payment_a.jpg"
              height="21"
              width="13"
              alt=""
            />
            <a href="index.html" style={{ color: "#ce1018" }}>
              <span className={styles["jb_conshop_ltb"]}>继续购物</span>
            </a>
          </button>
        </div>
        <div className={styles["jb_settlement"]}>
          <button className={styles["jb_settlement_a"]}>
            <a href="结算中心.html">
              <span className={styles["jb_settlement_b"]}>￥去结算</span>
            </a>
            <img
              className={styles["jb_settlement_c"]}
              src="/images/payment_b.jpg"
              height="20"
              width="13"
              alt=""
            />
          </button>
        </div>
      </div>
      {/* <div>
        <iframe
          className={styles["xst_foot"]}
          src="分页/版权商标.html"
        ></iframe>
      </div> */}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  const user = await getUserFromReq(ctx.req);
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  const res = await axios.post(`${base_URL}/api/good/cart`, {
    username: user.USERNAME,
  });
  const list = res.data.list;
  const promises = [];
  if (list?.length) {
    list.forEach((element: { goodIds: any }) => {
      promises.push(
        axios.post(`${base_URL}/api/good/detail`, {
          id: element.goodIds,
        })
      );
    });
  }
  const detailList = [];
  const detailData = await Promise.all(promises);
  detailData.forEach((item, index) => {
    detailList.push(item.data.detail[0]);
  });

  return {
    props: {
      user: {
        name: user.USERNAME,
      },
      detailList,
    },
  };
};
