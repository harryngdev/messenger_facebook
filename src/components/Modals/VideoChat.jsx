import { Avatar } from "antd";
import { AppContext } from "context/AppProvider";
import { AuthContext } from "context/AuthProvider";
import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ReactComponent as CreateCallIcon } from "assets/icons/create-call-icon.svg";
import { ReactComponent as AttendIcon } from "assets/icons/attend-icon.svg";

const VideoChat = () => {
  const {
    isShowModalVideoChat,
    setIsShowModalVideoChat,
    setIsShowPopupVideoChat,
    joinCode,
    setJoinCode,
    setCurrentPage,
  } = React.useContext(AppContext);

  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext);

  const handleClose = () => {
    setIsShowModalVideoChat(false);
    setJoinCode("");
  };

  const handleCreateVideoChat = () => {
    setIsShowPopupVideoChat(true);
    setCurrentPage("create");
    setIsShowModalVideoChat(false);
  };

  const handleAttendVideoChat = () => {
    setIsShowPopupVideoChat(true);
    setCurrentPage("join");
    setIsShowModalVideoChat(false);
  };

  return (
    <div>
      <Modal
        show={isShowModalVideoChat}
        onHide={handleClose}
        className="modal-video-chat__wrapper"
        centered
      >
        <Modal.Body>
          <div className="modal-video-chat__inner">
            <div className="modal-video-chat__user-info">
              <Avatar src={photoURL} size={72}>
                {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <h1 className="modal-video-chat__user-info--name">
                {displayName}'s Video Call
              </h1>
              <p className="modal-video-chat__user-info--sub-title">
                Wait for friends to join or call to let them
                <br />
                know you're here.
              </p>
            </div>

            <div className="modal-video-chat__action">
              <div className="modal-video-chat__action-create">
                <Button
                  className="btn-video-chat btn-create-call"
                  onClick={handleCreateVideoChat}
                >
                  <CreateCallIcon /> Create Call
                </Button>
              </div>

              <div className="modal-video-chat__action-join">
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Join with code"
                  className="input-code-join"
                />
                <Button
                  className="btn-video-chat btn-join-call"
                  onClick={handleAttendVideoChat}
                >
                  <AttendIcon /> Join
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VideoChat;
