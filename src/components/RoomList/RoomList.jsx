import React from "react";
import { Avatar, Typography, Collapse } from "antd";
import styled from "styled-components";
import { AppContext } from "../../context/AppProvider";

const PanelStyled = styled(Collapse.Panel)`
  &&& {
    .ant-collapse-content-box {
      padding: 0 8px;
      padding-bottom: 20px;
    }
  }
`;

const RoomList = ({ chatWindowRef }) => {
  const { rooms, setSelectedRoomId } = React.useContext(AppContext);

  return (
    <Collapse ghost collapsible="header" defaultActiveKey={["1"]}>
      <PanelStyled header="Chat" key="1">
        {rooms.map((room) => (
          <Typography.Link
            key={room.id}
            className="room-item"
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
        ))}
      </PanelStyled>
    </Collapse>
  );
};

RoomList.propTypes = {};

export default RoomList;
