import React from "react";
import { Menu, Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import cloudbase from "@cloudbase/js-sdk/app";
import "@cloudbase/js-sdk/auth";
import "./Navigator.css";

const app = cloudbase.init({
  env: "wxxcx-29w9p",
});

const auth = app.auth({
  persistence: "local", //用户显式退出或更改密码之前的30天一直有效
});

const { SubMenu } = Menu;

function Navigator() {
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("logout success");
        sessionStorage.setItem("isLogin", 0);
      })
      .then(() => window.location.reload());
  };
  return (
    <div className="navigator">
      <Menu style={{ width: 180 }} defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1">
          <Link to={"/"}>Welcome ❤️</Link>
        </Menu.Item>
        <SubMenu key="sub1" title="Manage ⚙️">
          <Menu.Item key="2">
            <Link to={"/home"}>Sections</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to={"/quiz"}>Quiz</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title="Statistics 📝">
          <Menu.Item key="4">
            <Link to={"/"}>Home</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
      <Button
        className="logout"
        type="primary"
        shape="round"
        icon={<LoginOutlined />}
        onClick={logout}
      >
        Log Out
      </Button>
    </div>
  );
}

export default Navigator;
