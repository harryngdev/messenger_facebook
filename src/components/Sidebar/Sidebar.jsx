import React from "react";
import { Row, Col } from "antd";

import UserInfo from "./../UserInfo/UserInfo";
import RoomList from "./../RoomList/RoomList";

const Sidebar = ({ chatWindowRef }) => {
  return (
    <Col className="sidebar">
      <Row>
        <Col span={24} className="user-info">
          <UserInfo />
        </Col>

        <Col span={24} className="room-list">
          <RoomList chatWindowRef={chatWindowRef} />
        </Col>
      </Row>
    </Col>
  );
};

export default Sidebar;
