import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const PlanForm = ({ visible, onCancel, onSubmit, plan }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (plan) {
      const values = {
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : [],
      };
      form.setFieldsValue(values);
    } else {
      form.resetFields();
    }
  }, [plan, form]);

  return (
    <Modal
      title={plan ? "Edit Plan" : "Add Plan"}
      open={visible}
      onCancel={onCancel}
      onOk={() =>
        form.validateFields().then((values) => {
          values.features = values.features || [];
          onSubmit(values);
        })
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the plan name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="offerPrice" label="Offer Price">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="planCredit"
          label="Plan Credits"
          rules={[{ required: true, message: "Please enter plan credits" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="features" label="Features">
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Type a feature and press Enter"
            tokenSeparators={[","]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlanForm;
