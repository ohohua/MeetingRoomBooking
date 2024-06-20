import http from "@/api";
import { Button, Form, Input, Table, TableColumnsType, message, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useMemo, useState } from "react";
import CreateMeetingRoomModal from "./roomModal";

interface DataType {
  id: number;
  isBooked: boolean;
  name: string;
  capacity: number;
  description: string;
  equipment: string;
  location: string;
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
  const [pageNo, setPageNo] = useState<number>(1);
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
    const { data, code } = await http.getRoomList(params);

    if (code === 200 || code === 201) {
      const list = data.list.map((it: DataType, index: number) => ({ ...it, key: index }));
      setList(list);
    }
  }

  async function freeze(id: number) {
    const { code, message: msg } = await http.freezeUser(id);
    if (code === 200 || code === 201) {
      message.success("冻结成功");
      useDataList();
    } else {
      message.error(msg);
    }
  }

  /**
   * 新增会议室
   */

  const [isOpen, setIsOpen] = useState(false);

  async function handleNewRoom() {
    // const res = await http.createRoom({
    //   name: "测试会议室",
    //   capacity: 10,
    //   description: "测试会议室",
    //   equipment: "投影仪",
    //   location: "测试会议室",
    // });
    // console.log(res);
    setIsOpen(true);
  }

  function handleList() {
    setPageNo(1);
    useDataList();
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
          <Button type="primary" htmlType="submit" onClick={handleList}>
            查询
          </Button>
        </Form.Item>

        <Form.Item name="password" wrapperCol={{ span: 16 }}>
          <Button type="primary" htmlType="submit" onClick={handleNewRoom}>
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
      <CreateMeetingRoomModal
        handleClose={() => {
          setIsOpen(false);
        }}
        isOpen={isOpen}
      />
    </div>
  );
};

export default RoomManage;