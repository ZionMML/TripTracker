import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../services/api";
import dayjs from "dayjs";
import type { CreateUserDto } from "../../types/types";

type UserDetailProps = {
  isEditMode?: boolean;
};

const UserDetail: React.FC<UserDetailProps> = ({ isEditMode = false }) => {
  //const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [form] = Form.useForm<CreateUserDto>();
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const { username } = useParams();
  const { data: user, refetch } = useGetUserQuery(username!, {
    skip: !isEditMode || !username,
  });

  useEffect(() => {
    if (isEditMode && user) {
      refetch();
      console.log("User Detail - User", JSON.stringify(user));
      form.setFieldsValue({
        ...user,
        dateOfBirth: user.dateOfBirth
          ? (dayjs(user.dateOfBirth) as unknown as string)
          : undefined,
      });
    }
  }, [isEditMode, user, form, refetch]);

  const handleSubmit = async (values: CreateUserDto) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
      };

      if (isEditMode) {
        await updateUser({
          username: username!,
          body: formattedValues,
        }).unwrap();
        message.success("User updated successfully!");
        setTimeout(() => {
          form.resetFields();
          navigate("/user/userslist");
        }, 500);
      } else {
        await createUser(formattedValues).unwrap();
        message.success("User created successfully!");
        setTimeout(() => {
          form.resetFields();
        }, 500);
      }
    } catch (error: unknown) {
      message.error("Failed to create user");
      console.log(error);
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        disabled={false}
        style={{ maxWidth: "1000px", margin: "0 auto" }}
        onFinish={handleSubmit}
      >
        <Row gutter={32}>
          <Col span={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Avatar
                shape="square"
                size={120}
                src="https://via.placeholder.com/120" // Change this to a dynamic image later
                alt="Profile"
                style={{ marginRight: "16px" }}
              />
              <div style={{ marginTop: "8px", color: "#999" }}>
                Profile Picture
              </div>
            </div>

            <Form.Item label="About" name="about">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="First Contact Person Name"
              name="firstContactName"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="First Contact Phone Number"
              name="firstContactPhNo"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Second Contact Person Name"
              name="secondContactName"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Second Contact Phone Number"
              name="secondContactPhNo"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            {" "}
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
              style={{ marginTop: "15px" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Known As"
              name="knownAs"
              rules={[{ required: true, message: "Known As is required" }]}
            >
              <Input />
            </Form.Item>
            {!isEditMode && (
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password />
              </Form.Item>
            )}
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
            <Form.Item style={{ marginTop: "55px" }}>
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
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default UserDetail;
