import { Avatar, Button, Dropdown, Menu, Tooltip, Typography } from "antd";
import { ReactComponent as GroupChatIcon } from "assets/icons/group-chat-icon.svg";
import { ReactComponent as MoreIcon } from "assets/icons/more-icon.svg";
import { ReactComponent as PrivateChatIcon } from "assets/icons/private-chat-icon.svg";
import { ReactComponent as VideoChatIcon } from "assets/icons/video-chat-icon.svg";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import darkModeSvg from "./../../assets/images/btn/Dark-Mode.svg";
import lightModeSvg from "./../../assets/images/btn/Light-Mode.svg";
import { auth } from "./../../firebase/config";

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

  const {
    setIsNewMessageVisible,
    setIsAddRoomVisible,
    setIsShowModalVideoChat,
    clearState,
  } = React.useContext(AppContext);

  const handleNewMessage = () => {
    setIsNewMessageVisible(true);
  };

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  const handleShowModalVideoChat = () => {
    setIsShowModalVideoChat(true);
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

      <Tooltip placement="topLeft" title="New message">
        <Button
          shape="circle"
          className="btn-new-message"
          onClick={handleNewMessage}
        >
          <PrivateChatIcon />
        </Button>
      </Tooltip>

      <Tooltip placement="topLeft" title="Create a new group">
        <Button shape="circle" className="btn-add-room" onClick={handleAddRoom}>
          <GroupChatIcon />
        </Button>
      </Tooltip>

      <Tooltip placement="topLeft" title="Start a video call">
        <Button
          shape="circle"
          className="btn-video-chat"
          onClick={handleShowModalVideoChat}
        >
          <VideoChatIcon />
        </Button>
      </Tooltip>

      <Tooltip placement="right" title="Options">
        <Button shape="circle" className="btn-more">
          <Dropdown overlay={menu} trigger={["click"]}>
            <MoreIcon />
          </Dropdown>
        </Button>
      </Tooltip>
    </UserInfoStyled>
  );
};

export default UserInfo;
