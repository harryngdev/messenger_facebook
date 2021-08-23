import React, { useState } from "react";
import { Layout, Progress } from "antd";

import LoginHeader from "./../components/Login/LoginHeader";
import LoginContent from "./../components/Login/LoginContent";
import LoginFooter from "./../components/Login/LoginFooter";
import Helmet from "./../components/Helmet/Helmet";

const LoginPage = (props) => {
  const [progressPercent, setProgressPercent] = useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);

  return (
    <Helmet title="Login - ">
      <div className="login-wrapper">
        <Layout>
          <LoginHeader />

          <LoginContent
            setProgressPercent={setProgressPercent}
            setIsProgressVisible={setIsProgressVisible}
          />

          <LoginFooter />
        </Layout>

        {isProgressVisible ? (
          <div className="progress-wrapper">
            <Progress percent={progressPercent} />
          </div>
        ) : (
          ""
        )}
      </div>
    </Helmet>
  );
};

LoginPage.propTypes = {};

export default LoginPage;
