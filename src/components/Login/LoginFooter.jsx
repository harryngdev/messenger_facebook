import React from "react";
import { Row, Col, Layout, Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import { CaretDownOutlined } from "@ant-design/icons";

import LogoFooter from "./../../assets/images/login-pages/logo-footer.jpg";

const language = (
  <Menu className="language">
    <Menu.Item key={0}>
      <Link to="/login">Tiếng Việt</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={1}>
      <Link to="/login">English (UK)</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={2}>
      <Link to="/login">English (US)</Link>
    </Menu.Item>
  </Menu>
);

const LoginFooter = () => {
  return (
    <Layout.Footer>
      <Row justify="center" align="middle">
        <Col>© Facebook 2021.</Col>
        <Col>
          Logo của Apple và Google Play là nhãn hiệu hàng hóa thuộc chủ sở hữu
          tương ứng.
        </Col>
        <Col>
          <Link to="/login">Chính sách dữ liệu</Link>
        </Col>
        <Col>
          <Link to="/login">Điều khoản</Link>
        </Col>
        <Col>
          <Dropdown overlay={language} trigger={["click"]}>
            <Link
              to="/login"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              Tiếng Việt <CaretDownOutlined />
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
