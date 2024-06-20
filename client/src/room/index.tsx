import http from "@/api";
import { Button, Form, Input, Table, TableColumnsType, message, Select, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateMeetingRoomModal from "./roomModal";
import { Room } from "@/api/room";

const RoomManage: React.FC = () => {
  const columns: TableColumnsType<Room.ListRoom> = useMemo(
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
          <div>
            <Popconfirm
              title="会议室删除"
              description="确认删除吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">删除</a>
            </Popconfirm>
            <br />
            <a href="#" onClick={() => setIsUpdateModalOpen(record.id)}>
              更新
            </a>
          </div>
        ),
      },
    ],
    [],
  );

  const [list, setList] = useState<Room.ListRoom[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  // 随机数
  const [num, setNum] = useState<number>(0);
  const [id, setId] = useState<number>();
  const [form] = useForm();

  const onFinish = () => {
    setPageNo(1);
    setNum(Math.random());
  };

  useEffect(() => {
    userDataList({
      pageNo,
      pageSize,
      name: form.getFieldValue("name"),
      isBooked: form.getFieldValue("isBooked"),
    });
  }, [num, pageNo, pageSize]);

  const changePage = useCallback((pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  async function userDataList(params: ListDto) {
    const { data, code } = await http.listRoom(params);

    if (code === 200 || code === 201) {
      const list = data.list.map((it: Room.ListRoom, index: number) => ({ ...it, key: index }));
      setList(list);
    } else {
      message.error("network error");
    }
  }

  async function handleDelete(id: number) {
    const { code, msg } = await http.deleteRoom(id);
    if (code === 200 || code === 201) {
      message.success("删除成功");
      setNum(Math.random());
    } else {
      message.error(msg);
    }
  }

  async function setIsUpdateModalOpen(id: number) {
    setId(id);
    setIsOpen(true);
  }

  /**
   * 新增,编辑会议室
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
          <Input allowClear />
        </Form.Item>

        <Form.Item label="是否预定" name="isBooked">
          <Select
            allowClear
            style={{ width: "170px" }}
            options={[
              { value: 1, label: "是" },
              { value: 0, label: "否" },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 16 }}>
          <Button type="primary" onClick={handleNewRoom}>
            新建
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={list}
        pagination={{
          showQuickJumper: true,
          current: pageNo,
          pageSize: pageSize,
          onChange: changePage,
        }}
      />
      <CreateMeetingRoomModal
        id={id}
        handleClose={() => {
          setIsOpen(false);
          onFinish();
        }}
        isOpen={isOpen}
      />
    </div>
  );
};

export default RoomManage;
