import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import firebase, { auth } from "./../../firebase/config";
import { addDocument, generateKeywords } from "../../firebase/services";

import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const LoginForm = (props) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { hasAccount, setHasAccount } = props;

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handleLogin = () => {
    clearErrors();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        // eslint-disable-next-line default-case
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handleSocialLogin = async (provider) => {
    /**
     * Cung cấp một Privider (Facebook, Google, etc)
     * auth là một Promise nên phải sử dụng await/async
     */
    /**
     * const data = await auth.signInWithPopup(fbProvider);
     * data: {
     *  additionalUserInfo: {
     *    isNewUser: kiểm tra user mới hay cũ trong firebase/authentication,
     *    etc...
     *  },
     *  etc...
     * }
     */
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

    /**
     * Kiểm tra có phải newUser thì lưu vào firebase
     */
    if (additionalUserInfo?.isNewUser) {
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId, // Kiểm tra user đăng nhập từ đâu (Ex: facebook -> facebook.com)
        keywords: generateKeywords(user.displayName?.toLowerCase()),
      });
    }
  };

  return (
    <Form name="login-form" className="login-form">
      <Form.Item>
        <Input
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          bordered={false}
          placeholder="Email"
        />
        {emailError ? (
          <Typography.Text className="msgError">{emailError}</Typography.Text>
        ) : (
          ""
        )}
      </Form.Item>
      <Form.Item>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          bordered={false}
          placeholder="Mật khẩu"
        />
        {passwordError ? (
          <Typography.Text className="msgError">
            {passwordError}
          </Typography.Text>
        ) : (
          ""
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>
        <Button
          type="text"
          className="btn-link"
          onClick={() => setHasAccount(!hasAccount)}
        >
          <p>
            Chưa có tài khoản? <span>Đăng ký</span>
          </p>
        </Button>
      </Form.Item>
      <Form.Item className="login-social">
        <FacebookLoginButton
          className="login-facebook"
          onClick={() => handleSocialLogin(fbProvider)}
        />

        <GoogleLoginButton
          className="login-google"
          onClick={() => handleSocialLogin(googleProvider)}
        />
      </Form.Item>
    </Form>
  );
};

LoginForm.propTypes = {};

export default LoginForm;
