import http from "@/api";
import { Button, Form, Input, Table, TableColumnsType, message, Image, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useMemo, useState } from "react";

interface DataType {
  id: number;
  isBooked: boolean;
}
const RoomManage: React.FC = () => {
  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "会议室名称",
        dataIndex: "name",
      },
      {
        title: "会议室地址",
        dataIndex: "location",
      },
      {
        title: "设备",
        dataIndex: "equipment",
      },
      {
        title: "描述",
        dataIndex: "description",
      },
      {
        title: "容纳人数",
        dataIndex: "capacity",
      },
      {
        title: "是否被预定",
        render: (_, record) => (record.isBooked ? "是" : "否"),
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
      },
      {
        title: "操作",
        render: (_, record) => (
          <a href="#" onClick={() => freeze(record.id)}>
            删除
          </a>
        ),
      },
    ],
    [],
  );

  const [list, setList] = useState<DataType[]>([]);
  const [pageNo] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const [form] = useForm();

  const onFinish = () => {
    useDataList();
  };

  async function useDataList() {
    const params = {
      pageNo,
      pageSize,
      username: form.getFieldValue("username"),
      email: form.getFieldValue("email"),
      nickName: form.getFieldValue("nickName"),
    };
    const res = await http.getRoomList(params);
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
    } else {
      message.error(res.data.message);
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
        autoComplete="off"
        layout="inline"
        style={{ marginBottom: "10px", width: "100%" }}
      >
        <Form.Item label="会议室名称" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="是否预定" name="isBooked">
          <Select
            style={{ width: "170px" }}
            options={[
              { value: 1, label: "是" },
              { value: 0, label: "否" },
            ]}
          />
        </Form.Item>

        <Form.Item name="password">
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>

        <Form.Item name="password" wrapperCol={{ span: 16 }}>
          <Button type="primary" htmlType="submit">
            新建
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

export default RoomManage;
