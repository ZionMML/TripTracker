import { Modal } from "antd";

const ConfirmAction = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Modal.confirm({
      title: "Confirmation",
      content: message,
      okText: "Yes",
      cancelText: "No",
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
};

export default ConfirmAction;
