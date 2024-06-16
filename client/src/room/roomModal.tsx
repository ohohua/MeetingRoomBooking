import React, { useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const RoomModal: React.ForwardRefRenderFunction<any> = (props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useImperativeHandle(ref, () => ({
    showModal,
  }));
  return (
    <>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default RoomModal;
