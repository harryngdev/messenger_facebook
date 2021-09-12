import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Avatar, Layout } from "antd";

import LogoHeader from "./../../assets/images/login-pages/logo-header.png";

const LoginHeader = () => {
  return (
    <Layout.Header>
      <Row
        justify="space-between"
        align="middle"
        style={{ height: "100px", maxWidth: "1195px", margin: "0 auto" }}
      >
        <Col>
          <Link to="/login">
            <Avatar shape="square" src={LogoHeader} size={40} />
          </Link>
        </Col>
        <Col>
          <Row className="header-nav">
            <Col>
              <Link to="/login">Rooms</Link>
            </Col>
            <Col>
              <Link to="/login">Features</Link>
            </Col>
            <Col>
              <Link to="/login">Privacy & Safety</Link>
            </Col>
            <Col>
              <Link to="/login">For Developers</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default LoginHeader;
