import React from "react";
import { Row, Col, Layout, Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import { CaretDownOutlined } from "@ant-design/icons";

import LogoFooter from "./../../assets/images/login-pages/logo-footer.jpg";

const language = (
  <Menu className="language">
    <Menu.Item key={0}>
      <Link to="/login">English (US)</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={1}>
      <Link to="/login">English (UK)</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={2}>
      <Link to="/login">Tiếng Việt</Link>
    </Menu.Item>
  </Menu>
);

const LoginFooter = () => {
  return (
    <Layout.Footer>
      <Row justify="center" align="middle">
        <Col>© Facebook 2021.</Col>
        <Col>
          The Apple and Google Play logos are trademarks of their respective
          owners.
        </Col>
        <Col>
          <Link to="/login">Data Policy</Link>
        </Col>
        <Col>
          <Link to="/login">Cookie Policy</Link>
        </Col>
        <Col>
          <Dropdown overlay={language} trigger={["click"]}>
            <Link
              to="/login"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              English (US) <CaretDownOutlined />
            </Link>
          </Dropdown>
        </Col>
        <Col>
          <img src={LogoFooter} alt="from-facebook" />
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default LoginFooter;
