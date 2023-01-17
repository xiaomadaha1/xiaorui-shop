/*
 * @Descripttion:
 * @version:
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-16 14:12:34
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-16 14:52:53
 */
import { message } from "antd";
import axios from "axios";
import React, { useRef } from "react";
import { useMutation } from "react-query";

export default function Index() {
  const username = useRef(null);
  const password = useRef(null);
  async function register({ usernameValue, passwordValue }) {
    await axios.post("/api/user/create", {
      username: usernameValue,
      password: passwordValue,
    });
  }

  const registerMutation = useMutation(register, {
    onSuccess() {
      message.success(`注册成功`);
      setTimeout(() => {
        location.href = "/login";
      }, 0.5);
    },
  });

  const onClick = () => {
    const usernameValue = username.current?.value;
    const passwordValue = password.current?.value;
    registerMutation.mutate({ usernameValue, passwordValue });
  };
  return (
    <div>
      <h1>Create account</h1>
      <div>
        <label>Username: </label>
        <input ref={username} type="text" />
      </div>
      <div>
        <label>Password: </label>
        <input ref={password} type="password" />
      </div>
      <button disabled={registerMutation.isLoading} onClick={onClick}>
        create account
      </button>
    </div>
  );
}
