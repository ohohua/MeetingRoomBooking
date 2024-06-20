import { useCallback, useEffect } from "react";
import { Form, Input, InputNumber, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useRequest } from "ahooks";
import { Room } from "@/api/room";
import http from "@/api";

export interface RoomProps {
  handleClose: () => void;
  isOpen: boolean;
  id?: number;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const RoomModal = (props: RoomProps) => {
  const { handleClose, isOpen, id } = props;

  const [form] = useForm<Room.CreateUpdateRoomDto>();

  const { updateRoom, createRoom } = http;
  const { loading, run } = useRequest(id ? updateRoom : createRoom, {
    manual: true,
    onSuccess: ({ data }) => {
      message.success(data);
      handleClose();
    },
    // @ts-ignore
    onError: ({ data }) => {
      message.error(data);
    },
  });

  const handleOk = useCallback(async () => {
    const values = form.getFieldsValue();
    values.equipment = values.equipment || "";
    values.description = values.description || "";
    if (id) values.id = id;
    run(values);
  }, []);

  const roomDetail = async (id: number) => {
    const { data, code } = await http.detailRoom(id);
    if (code === 200 || code === 201) {
      Object.entries(data).forEach(([key, value]) => {
        form.setFieldValue(key, value);
      });
    } else {
      message.error(data as string);
    }
  };
  useEffect(() => {
    if (id) {
      roomDetail(id);
    }
  }, [id]);
  return (
    <>
      <Modal
        title="创建会议室"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleClose}
        confirmLoading={loading}
        okText={"确定"}
        cancelText={"取消"}
      >
        <Form form={form} colon={false} {...layout}>
          <Form.Item
            label="会议室名称"
            name="name"
            rules={[{ required: true, message: "请输入会议室名称!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="位置"
            name="location"
            rules={[{ required: true, message: "请输入会议室位置!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="容纳人数"
            name="capacity"
            rules={[{ required: true, message: "请输入会议室容量!" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item label="设备" name="equipment">
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoomModal;
