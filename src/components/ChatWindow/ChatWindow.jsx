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
  Upload,
  Modal,
  Spin,
} from "antd";
import { UsergroupAddOutlined, LeftOutlined } from "@ant-design/icons";
import { addDocument } from "../../firebase/services";
import Message from "../Message/Message";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import useFireStore from "../../hooks/useFirestore";
import { PlusOutlined } from "@ant-design/icons";
import { storage } from "../../firebase/config";
import Picker from "emoji-picker-react";
import getBase64 from "../../utils/getBase64";

import logo from "./../../assets/images/logo/messenger.svg";
import formatDate from "../../utils/formatDate";

const ChatWindow = ({ chatWindowRef }) => {
  const {
    selectedRoom,
    members,
    setSelectedRoomId,
    setIsInviteMemberVisible,
    stickerCollection,
  } = React.useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = React.useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [isSpinVisible, setIsSpinVisible] = useState(false);
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
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

  /**
   * Handle Scroll Message To Bottom
   */
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Handle Sticker Wrapper
   */
  const [isStickerListVisible, setIsStickerListVisible] = useState(false);

  const handleStickerListVisible = () => {
    setIsStickerListVisible(!isStickerListVisible);
  };

  const stickerWrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        stickerWrapperRef.current &&
        !stickerWrapperRef.current.contains(event.target)
      ) {
        setIsStickerListVisible(!isStickerListVisible);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStickerListVisible]);

  /**
   * Handle Emoji Box
   */
  const [isEmojiBoxVisible, setIsEmojiBoxVisible] = useState(false);

  const handleEmojiBoxVisible = () => {
    setIsEmojiBoxVisible(!isEmojiBoxVisible);
  };

  const emojiBoxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiBoxRef.current && !emojiBoxRef.current.contains(event.target)) {
        setIsEmojiBoxVisible(!isEmojiBoxVisible);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmojiBoxVisible]);

  const onEmojiClick = (event, emojiObject) => {
    form.setFieldsValue({
      message: inputValue.concat(emojiObject.emoji),
    });
    setInputValue(inputValue.concat(emojiObject.emoji));
  };

  /**
   * Handle Send Image
   */
  const [image, setImage] = useState(null);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleImgCancel = () => {
    setPreviewVisible(false);
  };

  const handleImgPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleUploadImage = ({ fileList }) => {
    setFileList(fileList);

    if (fileList.length > 0) {
      setImage(fileList[0].originFileObj);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="upload-btn-title" style={{ marginTop: 8 }}>
        Upload
      </div>
    </div>
  );

  /**
   * Handle Submit
   */
  const handleCancel = () => {
    form.resetFields(["message"]);
    setInputValue("");

    /**
     * focus to input again after submit
     */
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }

    setFileList([]);
    setImage(null);
  };

  const handleOnSubmit = (type) => {
    if (type === "text") {
      if (fileList.length === 0) {
        /**
         * Trường hợp user gửi tin nhắn
         */
        addDocument("messages", {
          text: inputValue,
          uid,
          photoURL,
          roomId: selectedRoom.id,
          displayName,
          type: "text",
        });

        /**
         * Handle Reset
         */
        handleCancel();
      } else {
        /**
         * Trường hợp user gửi hình ảnh
         */
        const uploadTask = storage
          .ref(`messages/images/${image.name}`)
          .put(image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setIsSpinVisible(true);
          },
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref("messages/images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                addDocument("messages", {
                  text: url,
                  uid,
                  photoURL,
                  roomId: selectedRoom.id,
                  displayName,
                  type: "image",
                });

                /**
                 * Handle Reset
                 */
                handleCancel();
                setIsSpinVisible(false);
              });
          }
        );
      }
    } else {
      /**
       * Trường hợp user gửi sticker
       */
      addDocument("messages", {
        text: type,
        uid,
        photoURL,
        roomId: selectedRoom.id,
        displayName,
        type: "sticker",
      });
    }
  };

  return (
    <Col className="chat-window" ref={chatWindowRef}>
      {selectedRoom.id ? (
        <>
          <div className="chat-window-header">
            <div className="header__back">
              <LeftOutlined
                type="icon-tuichu"
                title="Back"
                className="header__back-btn"
                onClick={() => {
                  setSelectedRoomId("");
                  chatWindowRef.current.classList.toggle("show");
                }}
              />
            </div>

            <div className="header__info">
              <div className="header__info-avt">
                <Avatar
                  src={
                    selectedRoom.type === "roomchat"
                      ? selectedRoom.backgroundURL
                      : selectedRoom.creator !== uid
                      ? selectedRoom.backgroundURL[0]
                      : selectedRoom.backgroundURL[1]
                  }
                  size={40}
                />
              </div>
              <div className="header__info-description">
                <Typography.Title className="header__info-description-title">
                  {selectedRoom.type === "roomchat"
                    ? selectedRoom.name
                    : selectedRoom.creator !== uid
                    ? selectedRoom.name[0]
                    : selectedRoom.name[1]}
                </Typography.Title>
                <Typography.Text className="header__info-description-details">
                  {selectedRoom.type === "roomchat"
                    ? selectedRoom.description
                    : formatDate(selectedRoom.description?.seconds)}
                </Typography.Text>
              </div>
            </div>

            <div className="header__control">
              {selectedRoom.type === "roomchat" ? (
                <Button
                  icon={<UsergroupAddOutlined />}
                  type="text"
                  title="Add people"
                  size="large"
                  className="header__control-btn-add-user"
                  style={{ color: "#4099ff", fontWeight: "bolder" }}
                  onClick={() => setIsInviteMemberVisible(true)}
                />
              ) : (
                ""
              )}

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
            {/* Handle Spin visible when user send Image */}
            {isSpinVisible ? <Spin tip="Loading..."></Spin> : ""}

            <div className="message-wrapper" ref={messagesEndRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  uid={mes.uid}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                  type={mes.type}
                />
              ))}
            </div>

            <div className="message-input">
              <Form className="message-input-inner" form={form}>
                <div className="btn-image-wrapper" title="Attach a photo">
                  <Button
                    className="btn-item btn-item-image"
                    type="text"
                    title="Attach a photo"
                  >
                    <svg viewBox="0 0 36 36" height="28px" width="28px">
                      <path
                        d="M13.5 16.5a2 2 0 100-4 2 2 0 000 4z"
                        fill="#4099ff"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7 12v12a4 4 0 004 4h14a4 4 0 004-4V12a4 4 0 00-4-4H11a4 4 0 00-4 4zm18-1.5H11A1.5 1.5 0 009.5 12v9.546a.25.25 0 00.375.217L15 18.803a6 6 0 016 0l5.125 2.96a.25.25 0 00.375-.217V12a1.5 1.5 0 00-1.5-1.5z"
                        fill="#4099ff"
                      ></path>
                    </svg>
                  </Button>

                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handleImgPreview}
                    onChange={handleUploadImage}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>

                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleImgCancel}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </div>

                <div className="btn-sticker-wrapper">
                  <Button
                    className={`btn-item btn-item-sticker ${
                      isStickerListVisible === true ? "active-pointer" : ""
                    }`}
                    type="text"
                    title="Choose a sticker"
                    onClick={handleStickerListVisible}
                  >
                    <svg viewBox="0 0 36 36" height="28px" width="28px">
                      <path
                        d="M8 12a4 4 0 014-4h12a4 4 0 014 4v5a1 1 0 01-1 1h-3a6 6 0 00-6 6v3a1 1 0 01-1 1h-5a4 4 0 01-4-4V12z"
                        fill="#4099ff"
                      ></path>
                      <path
                        d="M20 27c0 .89 1.077 1.33 1.707.7l5.993-5.993c.63-.63.19-1.707-.7-1.707h-3a4 4 0 00-4 4v3z"
                        fill="#4099ff"
                      ></path>
                    </svg>
                  </Button>

                  {isStickerListVisible ? (
                    <div className="list-sticker" ref={stickerWrapperRef}>
                      {stickerCollection.map((item) => (
                        <div
                          key={item.id}
                          className="sticker-item-wrapper"
                          onClick={() => {
                            handleOnSubmit(item.url);
                            setIsStickerListVisible(!isStickerListVisible);
                          }}
                        >
                          <img src={item.url} alt={item.name} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <Form.Item name="message" className="input-item">
                  <Input
                    ref={inputRef}
                    bordered={false}
                    autoComplete="off"
                    placeholder="Aa"
                    onChange={handleInputChange}
                    onPressEnter={() => handleOnSubmit("text")}
                  />
                </Form.Item>

                <div className="btn-emoji-wrapper">
                  <Button
                    className={`btn-item btn-item-emoji ${
                      isEmojiBoxVisible === true ? "active-pointer" : ""
                    }`}
                    type="text"
                    title="Choose an emoji"
                    onClick={handleEmojiBoxVisible}
                  >
                    <svg height="28px" viewBox="0 0 36 36" width="28px">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18 29c6.075 0 11-4.925 11-11S24.075 7 18 7 7 11.925 7 18s4.925 11 11 11zm-5.25-13c0-1.25.563-2 1.5-2 .938 0 1.5.75 1.5 2s-.563 2-1.5 2c-.938 0-1.5-.75-1.5-2zm7.5 0c0-1.25.563-2 1.5-2 .938 0 1.5.75 1.5 2s-.563 2-1.5 2c-.938 0-1.5-.75-1.5-2zm-7.52 5.464a1 1 0 011.41-.12 5.963 5.963 0 003.856 1.406c1.47 0 2.813-.528 3.856-1.406a1 1 0 111.288 1.53 7.962 7.962 0 01-5.144 1.876 7.962 7.962 0 01-5.144-1.877 1 1 0 01-.121-1.409z"
                        fill="#4099ff"
                      ></path>
                    </svg>
                  </Button>

                  {isEmojiBoxVisible ? (
                    <div className="emoji-box" ref={emojiBoxRef}>
                      <Picker onEmojiClick={onEmojiClick} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <Button
                  className="btn-item btn-item-send"
                  type="text"
                  title="Send"
                  onClick={() => handleOnSubmit("text")}
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

export default ChatWindow;
