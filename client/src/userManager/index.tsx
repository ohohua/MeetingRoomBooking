import React, { useEffect, useMemo, useState } from "react";
import { Table, Form, Button, Input, Image, message, Badge } from "antd";
import type { FormProps, TableColumnsType } from "antd";
import http from "@/api";
import type { User } from "@/api/user";
import { useForm } from "antd/es/form/Form";

const UserManage: React.FC = () => {
  const columns: TableColumnsType<User.UserList> = useMemo(
    () => [
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
        title: "状态",
        render: (_, record) => (record.isFrozen ? <Badge status="success">已冻结</Badge> : ""),
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
    ],
    [],
  );

  const [list, setList] = useState<User.UserList[]>([]);
  const [pageNo] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const [form] = useForm();

  const onFinish: FormProps["onFinish"] = () => {
    useDataList();
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  async function useDataList() {
    const params = {
      pageNo,
      pageSize,
      username: form.getFieldValue("username"),
      email: form.getFieldValue("email"),
      nickName: form.getFieldValue("nickName"),
    };
    const { code, data } = await http.userList(params);
    if (code === 200 || code === 201) {
      const list = data.list.map((it: User.UserList, index: number) => ({ ...it, key: index }));
      setList(list);
    }
  }
  async function freeze(id: number) {
    const { code, msg } = await http.freezeUser(id);
    if (code === 200 || code === 201) {
      message.success("冻结成功");
      useDataList();
    } else {
      message.error(msg);
    }
  }
  useEffect(() => {
    useDataList();
  }, [pageNo, pageSize]);

  return (
    <div>
      <Form
        form={form}
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
      <Table
        columns={columns}
        dataSource={list}
        pagination={{
          current: pageNo,
          pageSize: pageSize,
          onChange: useDataList,
        }}
      />
    </div>
  );
};

export default UserManage;
