/*
 * @Descripttion:
 * @version:
 * @Author: ZhengXiaoRui
 * @email: 376769757@qq.com
 * @Date: 2023-01-19 18:10:40
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-01-19 18:17:52
 */
import React, { useState } from "react";
import { Button, Select } from "antd";
import jsonp from "fetch-jsonp";
import qs from "qs";
import type { SelectProps } from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetch = (value: string, callback: Function) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const fake = () => {
    const str = qs.stringify({
      code: "utf-8",
      q: value,
    });
    jsonp(`https://suggest.taobao.com/sug?${str}`) //由于数据不够借鉴了淘宝的数据
      .then((response: any) => response.json())
      .then((d: any) => {
        if (currentValue === value) {
          const { result } = d;
          const data = result.map((item: any) => ({
            value: item[0],
            text: item[0],
          }));
          callback(data);
        }
      });
  };

  timeout = setTimeout(fake, 300);
};

const SearchInput: React.FC<{
  placeholder: string;
  style: React.CSSProperties;
}> = (props) => {
  const [data, setData] = useState<SelectProps["options"]>([]);
  const [value, setValue] = useState<string>();

  const handleSearch = (newValue: string) => {
    if (newValue) {
      fetch(newValue, setData);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Select
        showSearch
        value={value}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={(data || []).map((d) => ({
          value: d.value,
          label: d.text,
        }))}
      />
      <Button style={{ backgroundColor: "red", color: "white" }}>搜索</Button>
    </>
  );
};

const App: React.FC = () => (
  <SearchInput placeholder="input search text" style={{ width: 200 }} />
);

export default SearchInput;
