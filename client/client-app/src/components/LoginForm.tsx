import React from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useLoginMutation } from "../services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { getUserInfoFromToken } from "../utils/auth";
import { setToken } from "../services/authService";

const { Title, Text } = Typography;

type LoginFormFields = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormFields) => {
    try {
      const result = await login(values).unwrap();

      //console.log("Login result:", result); // Should log an object with a string token
      //console.log("Type of result.token:", typeof result.token); // Should be "string"
      const tokenInfo = getUserInfoFromToken(result.token);

      if (tokenInfo) {
        dispatch(
          setUser({
            username: values.username,
            userId: tokenInfo.userId,
            knownAs: "",
            role: tokenInfo.role,
            exp: tokenInfo.exp,
            token: result.token,
            refreshToken: result.refreshToken,
          })
        );
        navigate("/home");
      }
      setToken(result.token, result.refreshToken);
    } catch {
      message.error("Invalid username or password", 3);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "#f0f2f5",
      }}
    >
      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 32,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 0 }}>
            Trip Tracker
          </Title>
          <Text type="secondary">Login to your account</Text>
        </div>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            {isLoading ? "Loading in..." : "Login"}
          </Button>
        </Form.Item>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Text type="secondary">
            Don't have an account? Contact admin to request access.
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
