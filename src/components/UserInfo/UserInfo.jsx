import React, { useEffect, useState } from "react";
import { Avatar, Typography, Button, Dropdown, Menu } from "antd";
import styled from "styled-components";
import { auth } from "./../../firebase/config";
import { AuthContext } from "../../context/AuthProvider";
import { AppContext } from "../../context/AppProvider";

import lightModeSvg from "./../../assets/images/btn/Light-Mode.svg";
import darkModeSvg from "./../../assets/images/btn/Dark-Mode.svg";

const UserInfoStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserInfo = (props) => {
  const [theme, setTheme] = useState("light");

  /**
   * Context API: Dùng cho project đơn giản thay thế cho Redux (kho dữ liệu chung, mọi components đều có thể truy xuất được)
   */
  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext);

  const { setIsNewMessageVisible, setIsAddRoomVisible, clearState } =
    React.useContext(AppContext);

  const handleNewMessage = () => {
    setIsNewMessageVisible(true);
  };

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme);

      setTheme(currentTheme);
    }
  }, []);

  const handleChangeTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  const menu = (
    <Menu className="dropdown-nav">
      <Menu.Item
        key="1"
        className="dropdown-btn-item"
        onClick={handleChangeTheme}
      >
        <Button type="text">
          <img
            src={theme === "light" ? darkModeSvg : lightModeSvg}
            alt="icon"
          />
        </Button>
        <span className="title">
          {theme === "light" ? "Dark" : "Light"} Mode
        </span>
      </Menu.Item>

      <Menu.Item
        key="2"
        className="dropdown-btn-item"
        onClick={() => {
          /**
           * clear state in App Provider when logout
           */
          clearState();
          auth.signOut();
        }}
      >
        <Button type="text">
          <svg viewBox="0 0 36 36" height="15.33" width="15.33">
            <path d="M21.498 14.75a1 1 0 001-1V12a4 4 0 00-4-4h-6.5a4 4 0 00-4 4v12a4 4 0 004 4h6.5a4 4 0 004-4v-1.75a1 1 0 00-1-1h-.5a1 1 0 00-1 1V24a1.5 1.5 0 01-1.5 1.5h-6.5a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5h6.5a1.5 1.5 0 011.5 1.5v1.75a1 1 0 001 1h.5z"></path>
            <path d="M14.498 16.75h9.752a.25.25 0 00.25-.25v-1.858a1 1 0 011.642-.766l4.002 3.356a1 1 0 010 1.532l-4.002 3.357a1 1 0 01-1.642-.767V19.5a.25.25 0 00-.25-.25h-9.752a1 1 0 01-1-1v-.5a1 1 0 011-1z"></path>
          </svg>
        </Button>
        <span className="title">Log Out</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <UserInfoStyled>
      <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
        <Avatar src={photoURL} size={36}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="title" title={displayName}>
          {displayName}
        </Typography.Text>
      </div>

      <Button
        shape="circle"
        className="btn-new-message"
        title="New message"
        onClick={handleNewMessage}
      >
        <svg viewBox="0 0 36 36" height="28" width="28">
          <path d="M17.305 16.57a1.998 1.998 0 00-.347.467l-1.546 2.87a.5.5 0 00.678.677l2.87-1.545c.171-.093.328-.21.466-.347l8.631-8.631a1.5 1.5 0 10-2.121-2.122l-8.631 8.632z"></path>
          <path d="M18 10.5a1 1 0 001-1V9a1 1 0 00-1-1h-6a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4v-6a1 1 0 00-1-1h-.5a1 1 0 00-1 1v6a1.5 1.5 0 01-1.5 1.5H12a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5h6z"></path>
        </svg>
      </Button>

      <Button
        shape="circle"
        className="btn-add-room"
        title="Create a new group"
        onClick={handleAddRoom}
      >
        <svg viewBox="0 0 36 36" height="28" width="28">
          <path
            clipRule="evenodd"
            d="M5 13.5a4 4 0 014-4h10a4 4 0 014 4v9a4 4 0 01-4 4H9a4 4 0 01-4-4v-9zm8 0a1 1 0 112 0v3.25c0 .138.112.25.25.25h3.25a1 1 0 110 2h-3.25a.25.25 0 00-.25.25v3.25a1 1 0 11-2 0v-3.25a.25.25 0 00-.25-.25H9.5a1 1 0 110-2h3.25a.25.25 0 00.25-.25V13.5z"
            fillRule="evenodd"
          ></path>
          <path d="M29.552 23.393l-3.723-1.861A1.5 1.5 0 0125 20.19v-4.38a1.5 1.5 0 01.829-1.342l3.723-1.861A1 1 0 0131 13.5v9a1 1 0 01-1.448.894z"></path>
        </svg>
      </Button>

      <Button shape="circle" className="btn-more" title="Options">
        <Dropdown overlay={menu} trigger={["click"]}>
          <svg viewBox="0 0 36 36" height="28" width="28">
            <path d="M12.5 18A2.25 2.25 0 118 18a2.25 2.25 0 014.5 0zm7.75 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm5.5 2.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"></path>
          </svg>
        </Dropdown>
      </Button>
    </UserInfoStyled>
  );
};

export default UserInfo;
