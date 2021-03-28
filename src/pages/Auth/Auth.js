import React, { useState } from "react";
import cloudbase from "@cloudbase/js-sdk/app";
import "@cloudbase/js-sdk/auth";
import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import "./Auth.css";

const app = cloudbase.init({
  env: "wxxcx-29w9p",
});

const auth = app.auth({
  persistence: "local", //用户显式退出或更改密码之前的30天一直有效
});

const { Title } = Typography;

function Auth() {
  const [status, setStatus] = useState("login");

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    if (status === "login") {
      auth
        .signInWithEmailAndPassword(values.email, values.password)
        .then((loginState) => {
          console.log("Sign in Success", loginState);
        })
        .then(() => {
          window.sessionStorage.setItem("isLogin", 1);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert("Login failed");
        });
    } else {
      auth
        .signUpWithEmailAndPassword(values.email, values.password)
        .then(() => {
          console.log("Sign up Success");
          alert("Click the validation link in your email and login to start!");
          setStatus("login");
        })
        .catch((err) => {
          console.log(err);
          alert("Sign Up failed");
        });
    }
  };

  return (
    <div className="auth">
      {status === "login" ? (
        <>
          <Title>Login</Title>
          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or <a onClick={() => setStatus("signup")}>sign up now!</a>
            </Form.Item>
          </Form>
        </>
      ) : (
        <>
          <Title>Sign Up</Title>
          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Sign Up
              </Button>
              Or <a onClick={() => setStatus("login")}>log in now!</a>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
}

export default Auth;
