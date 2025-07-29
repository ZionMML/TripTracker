import React, { useEffect, useState } from "react";
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
  Upload,
  Tooltip,
  Popconfirm,
  Spin,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddPhotoMutation,
  useCreateUserMutation,
  useDeletePhotoMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../services/api";
import dayjs from "dayjs";
import type { CreateUserDto } from "../../types/types";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import type { RcFile } from "antd/es/upload";
import ConfirmAction from "../../components/ConfirmAction";

type UserDetailProps = {
  isNewMode?: boolean;
  isEditMode?: boolean;
};

const UserDetail: React.FC<UserDetailProps> = ({
  isNewMode = false,
  isEditMode = false,
}) => {
  //const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [form] = Form.useForm<CreateUserDto>();
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [addPhoto] = useAddPhotoMutation();
  const [deletePhoto] = useDeletePhotoMutation();

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userInfo = useSelector((state: RootState) => state.auth);
  //console.log("Logged in as:", userInfo.user?.username);
  //console.log("Known as:", userInfo.user?.knownAs);
  //console.log("Role:", userInfo.user?.role);
  //console.log("Token expiry:", userInfo.user?.exp);

  const params = useParams();
  const username = isNewMode
    ? null
    : isEditMode
    ? params.username
    : userInfo.user?.username;
  const { data: user } = useGetUserQuery(username!, {
    skip: !username,
  });

  //console.log("isEditMode:", isEditMode);
  console.log("user", user);

  useEffect(() => {
    if (username && user) {
      form.setFieldsValue({
        ...user,
        dateOfBirth: user.dateOfBirth
          ? (dayjs(user.dateOfBirth) as unknown as string)
          : undefined,
      });
    }
  }, [user, form, username]);

  const handleSubmit = async (values: CreateUserDto) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
      };

      if (!isNewMode) {
        await updateUser({
          username: username!,
          body: formattedValues,
        }).unwrap();
        message.success("User updated successfully!");
        setTimeout(() => {
          if (isEditMode) {
            form.resetFields();
            navigate("/user/userslist");
          }
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
      console.error(error);
    }
  };

  const handleDelete = async (photoId: number, username: string) => {
    setIsDeleting(true);
    try {
      await deletePhoto({ photoId, username }).unwrap();
      message.success("Photo deleted");
    } catch {
      message.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Spin
        spinning={isUploading || isDeleting}
        tip={isUploading ? "Uploading photo..." : "Deleting photo..."}
        size="large"
      >
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
                  alignItems: "flex-end",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <Avatar
                  shape="square"
                  size={120}
                  src={user?.profilePhotoUrl || "../../assets/user.png"}
                  alt="Profile"
                />

                <Upload
                  name="file"
                  showUploadList={false}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    if (user?.profilePhotoId) {
                      const confirmed = await ConfirmAction(
                        "You already have a profile photo. Please delete it before uploading a new one."
                      );
                      if (!confirmed) {
                        onError?.(new Error("Upload canceled by user."));
                        return;
                      }
                      message.info("Please delete the current photo first.");
                      onError?.(
                        new Error("Upload not allowed until photo is deleted.")
                      );
                      return;
                    }
                    const actualFile = file as RcFile; // AntD uses RcFile internally

                    const formData = new FormData();
                    formData.append("file", actualFile);
                    formData.append("isProfilePhoto", "true");

                    setIsUploading(true);
                    try {
                      await addPhoto({
                        file: actualFile,
                        isProfilePhoto: true,
                        username: username!,
                      }).unwrap();

                      message.success("Photo uploaded");
                      onSuccess?.({}, new XMLHttpRequest()); // Notify Upload component of success
                    } catch (err) {
                      message.error("Upload failed");
                      onError?.(err as Error);
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                >
                  <Tooltip title="Upload photo">
                    {" "}
                    <Button
                      icon={<UploadOutlined />}
                      type="primary"
                      style={{
                        backgroundColor: "#1677ff",
                        borderColor: "#1677ff",
                      }}
                    />
                  </Tooltip>
                </Upload>
                <Tooltip title="Delete photo">
                  <Popconfirm
                    title="Are you sure to delete the photo?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => {
                      if (!user?.profilePhotoId) return;
                      handleDelete(user?.profilePhotoId, username!);
                    }}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      type="primary"
                      style={{
                        backgroundColor: "#ff4d4f",
                        borderColor: "#ff4d4f",
                      }}
                    />
                  </Popconfirm>
                </Tooltip>
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
              {isNewMode && (
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
                rules={[
                  { required: true, message: "Date of Birth is required" },
                ]}
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
      </Spin>
    </>
  );
};

export default UserDetail;
