import React from "react";
import { Button, DatePicker, Form, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../services/api";
import dayjs from "dayjs";
import type { CreateUserDto } from "../../types/types";

const UserDetail: React.FC = () => {
  //const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [form] = Form.useForm<CreateUserDto>();
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (values: CreateUserDto) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
      };

      await createUser(formattedValues).unwrap();
      message.success("User created successfully!");
      form.resetFields();
      navigate("/userlist");
    } catch (error: unknown) {
      message.error("Failed to create user");
      console.log(error);
    }
  };

  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={false}
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Known As"
          name="knownAs"
          rules={[{ required: true, message: "Known As is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Gender is required" }]}
        >
          <Select>
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Others">Others</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Date Of Birth"
          name="dateOfBirth"
          rules={[{ required: true, message: "Date of Birth is required" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: "City is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: "Country is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button
            htmlType="button"
            style={{
              marginRight: "10px",
              backgroundColor: "red",
              color: "white",
              borderColor: "red",
            }}
            onClick={() => form.resetFields()}
          >
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserDetail;
