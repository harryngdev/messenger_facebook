import React, { useRef } from "react";
// import PropTypes from "prop-types";
import { Row, Progress } from "antd";

import Sidebar from "./../components/Sidebar/Sidebar";
import ChatWindow from "./../components/ChatWindow/ChatWindow";
import Helmet from "./../components/Helmet/Helmet";
import styled from "styled-components";
import { AppContext } from "../context/AppProvider";

const WrapperStyled = styled(Row)`
  height: 100vh;
  background-color: #fff;
`;

const ChatRoomPage = (props) => {
  const chatWindowRef = useRef(null);

  const { progressPercentRoom, isProgressRoomVisible } =
    React.useContext(AppContext);

  return (
    <Helmet title="Home - ">
      <WrapperStyled>
        <Sidebar chatWindowRef={chatWindowRef} />

        <ChatWindow chatWindowRef={chatWindowRef} />

        {isProgressRoomVisible ? (
          <div className="progress-wrapper">
            <Progress percent={progressPercentRoom} />
          </div>
        ) : (
          ""
        )}
      </WrapperStyled>
    </Helmet>
  );
};

ChatRoomPage.propTypes = {};

export default ChatRoomPage;
