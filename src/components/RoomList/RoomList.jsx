import React from "react";
import { Avatar, Typography, Collapse } from "antd";
import styled from "styled-components";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import formatDate from "../../utils/formatDate";

const PanelStyled = styled(Collapse.Panel)`
  &&& {
    .ant-collapse-content-box {
      padding: 0 8px;
      padding-bottom: 20px;
    }
  }
`;

const RoomList = ({ chatWindowRef }) => {
  const { rooms, selectedRoomId, setSelectedRoomId } =
    React.useContext(AppContext);
  const {
    user: { uid },
  } = React.useContext(AuthContext);

  return (
    <Collapse ghost collapsible="header" defaultActiveKey={["1"]}>
      <PanelStyled header="Chats" key="1">
        {rooms.map((room) =>
          room.type === "roomchat" ? (
            <Typography.Link
              key={room.id}
              className={`room-item ${
                selectedRoomId === room.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedRoomId(room.id);
                chatWindowRef.current.classList.toggle("show");
              }}
            >
              <Avatar
                src={room.backgroundURL}
                size={56}
                className="room-item-avt"
              >
                {room.backgroundURL ? "" : room.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="room-item-desc">
                <Typography.Text className="room-item-desc-name">
                  {room.name}
                </Typography.Text>
                <Typography.Text className="room-item-desc-details">
                  {room.description}
                </Typography.Text>
              </div>
            </Typography.Link>
          ) : (
            <Typography.Link
              key={room.id}
              className={`room-item ${
                selectedRoomId === room.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedRoomId(room.id);
                chatWindowRef.current.classList.toggle("show");
              }}
            >
              {/* {room.backgroundURL[0]} */}
              <Avatar
                src={
                  room.creator !== uid
                    ? room.backgroundURL[0]
                    : room.backgroundURL[1]
                }
                size={56}
                className="room-item-avt"
              />
              <div className="room-item-desc">
                <Typography.Text className="room-item-desc-name">
                  {room.creator !== uid ? room.name[0] : room.name[1]}
                </Typography.Text>
                <Typography.Text className="room-item-desc-details">
                  {formatDate(room.description?.seconds)}
                </Typography.Text>
              </div>
            </Typography.Link>
          )
        )}
      </PanelStyled>
    </Collapse>
  );
};

export default RoomList;
