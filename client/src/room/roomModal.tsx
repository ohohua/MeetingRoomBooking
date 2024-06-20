import { useCallback } from "react";
import { Form, Input, InputNumber, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useRequest } from "ahooks";
import { createRoom } from "@/api/room";
import { Room } from "@/api/room";

export interface RoomProps {
  handleClose: () => void;
  isOpen: boolean;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const RoomModal = (props: RoomProps) => {
  const { handleClose, isOpen } = props;

  const [form] = useForm<Room.CreateUpdateRoomDto>();

  const { loading, run } = useRequest(createRoom, {
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
    run(values);
  }, []);

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
