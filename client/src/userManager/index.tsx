import React, { useEffect, useState } from "react";
import { Table, Form, Button, Input, Image, message } from "antd";
import type { FormProps, TableColumnsType } from "antd";
import http from "@/api";

interface DataType {
  key: React.Key;
  id: number;
  username: string;
  nickName: string;
  headPic: string;
  email: string;
  isFrozen: boolean;
}

const UserManage: React.FC = () => {
  const columns: TableColumnsType<DataType> = [
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "头像",
      dataIndex: "headPic",
      render: (value) => {
        return value ? <Image width={50} src={`http://localhost:3005/${value}`} /> : "";
      },
    },
    {
      title: "昵称",
      dataIndex: "nickName",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "注册时间",
      dataIndex: "createTime",
      render: (value) => (value ? new Date(value).toLocaleDateString() : ""),
    },
    {
      title: "操作",
      render: (_, record) =>
        record.isFrozen ? (
          <a href="#" onClick={() => freeze(record.id)}>
            冻结
          </a>
        ) : (
          ""
        ),
    },
  ];

  const [list, setList] = useState<DataType[]>([]);

  const onFinish: FormProps["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  async function useDataList() {
    const params = { pageNo: 1, pageSize: 10 };
    const res = await http.userList(params);
    if (res.data.code === 200 || res.data.code === 201) {
      const list = res.data.data.list.map((it: DataType, index: number) => ({ ...it, key: index }));
      setList(list);
    }
  }
  async function freeze(id: number) {
    const res = await http.freezeUser(id);
    if (res.data.code === 200 || res.data.code === 201) {
      message.success("冻结成功");
      useDataList();
      return;
    } else {
      message.error(res.data.message);
    }
  }
  useEffect(() => {
    useDataList();
  }, []);
  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="inline"
        style={{ marginBottom: "10px" }}
      >
        <Form.Item label="用户名" name="username">
          <Input />
        </Form.Item>

        <Form.Item label="昵称" name="nickName">
          <Input />
        </Form.Item>

        <Form.Item label="邮箱" name="nickName">
          <Input />
        </Form.Item>

        <Form.Item name="password" wrapperCol={{ span: 16 }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={list} />
    </div>
  );
};

export default UserManage;
