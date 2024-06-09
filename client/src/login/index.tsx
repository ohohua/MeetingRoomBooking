import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import { login } from "@/api/login";

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

type FieldType = {
  username?: string;
  password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  const { username = "", password = "" } = values;
  const res = await login(username, password);

  if (res.data.code === 201 || res.data.code === 200) {
    message.success("登录成功");
  } else {
    message.error(res.data);
  }
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login: React.FC = () => (
  <div className="relative-center w-[400px]">
    <Form
      {...formLayout}
      name="basic"
      style={{ maxWidth: 600 }}
      colon={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item wrapperCol={{ span: 24 }}>
        <h1 className="mb-2 text-xl font-bold text-center">会议室预定系统</h1>
      </Form.Item>
      <Form.Item<FieldType>
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="密码"
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <div className="flex justify-around">
          <Button type="link">创建账号</Button>

          <Button type="link">忘记密码</Button>
        </div>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <div className="text-center">
          <Button type="primary" style={{ width: "100%" }} htmlType="submit">
            登录
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

export default Login;
