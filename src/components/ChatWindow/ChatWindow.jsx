import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Form,
  Input,
  Alert,
} from "antd";
import { UsergroupAddOutlined, LeftOutlined } from "@ant-design/icons";
import { addDocument } from "../../firebase/services";
import Message from "../Message/Message";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import useFireStore from "../../hooks/useFirestore";

import logo from "./../../assets/images/logo/messenger.svg";

const ChatWindow = ({ chatWindowRef }) => {
  const { selectedRoom, members, setIsInviteMemberVisible } =
    React.useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = React.useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    addDocument("messages", {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });

    form.resetFields(["message"]);

    /**
     * focus to input again after submit
     */
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const msgCondition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFireStore("messages", msgCondition);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Col className="chat-window" ref={chatWindowRef}>
      {selectedRoom.id ? (
        <>
          <div className="chat-window-header">
            <div className="header__back">
              <LeftOutlined
                type="icon-tuichu"
                title="Quay lại"
                className="header__back-btn"
                onClick={() => chatWindowRef.current.classList.toggle("show")}
              />
            </div>
            <div className="header__info">
              <div className="header__info-avt">
                <Avatar src={selectedRoom.backgroundURL} size={40}>
                  {selectedRoom.backgroundURL
                    ? ""
                    : selectedRoom.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </div>
              <div className="header__info-description">
                <Typography.Title className="header__info-description-title">
                  {selectedRoom.name}
                </Typography.Title>
                <Typography.Text className="header__info-description-details">
                  {selectedRoom.description}
                </Typography.Text>
              </div>
            </div>

            <div className="header__control">
              <Button
                icon={<UsergroupAddOutlined />}
                type="text"
                title="Thêm thành viên"
                size="large"
                className="header__control-btn-add-user"
                style={{ color: "#4099ff", fontWeight: "bolder" }}
                onClick={() => setIsInviteMemberVisible(true)}
              />

              <Avatar.Group
                maxCount={2}
                className="header__control-avt-group"
                style={{ cursor: "pointer" }}
              >
                {members.map((member) => (
                  <Tooltip key={member.id} title={member.displayName}>
                    <Avatar src={member.photoURL} style={{ cursor: "pointer" }}>
                      {member.photoURL
                        ? ""
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          </div>

          <div className="chat-window-content">
            <div className="message-wrapper">
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  uid={mes.uid}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="message-input">
              <Form className="message-input-inner" form={form}>
                <Form.Item name="message" className="input-item">
                  <Input
                    ref={inputRef}
                    bordered={false}
                    autoComplete="off"
                    placeholder="Aa"
                    onChange={handleInputChange}
                    onPressEnter={handleOnSubmit}
                  />
                </Form.Item>

                <Button
                  className="btn-item"
                  type="text"
                  onClick={handleOnSubmit}
                >
                  <svg width="20px" height="20px" viewBox="0 0 24 24">
                    <path
                      d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
                      fill="#4099ff"
                      fillRule="evenodd"
                      stroke="none"
                    ></path>
                  </svg>
                </Button>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <div className="chat-window-empty">
          <Alert
            message="Xin chào 👋👋👋"
            description="Hãy chọn phòng để có thể trò chuyện."
            type="info"
            showIcon
            closable
          />

          <div className="chat-window-empty-img-wrapper">
            <img src={logo} alt="messenger" />
          </div>
        </div>
      )}
    </Col>
  );
};

ChatWindow.propTypes = {};

export default ChatWindow;
