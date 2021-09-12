import React, { useState } from "react";
import { Form, Input, Button, Typography, Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import firebase, { storage } from "./../../firebase/config";
import { addDocument, generateKeywords } from "../../firebase/services";
import validateEmail from "../../utils/validateEmail";
import getBase64 from "../../utils/getBase64";

const RegisterForm = ({
  hasAccount,
  setHasAccount,
  setProgressPercent,
  setIsProgressVisible,
}) => {
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleUploadImage = ({ fileList }) => {
    setFileList(fileList);

    if (fileList.length > 0) {
      setImage(fileList[0].originFileObj);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="upload-btn-title" style={{ marginTop: 8 }}>
        Avatar
      </div>
    </div>
  );

  const clearErrors = () => {
    setDisplayNameError("");
    setEmailError("");
    setPasswordError("");
    setImageError("");
  };

  const handleSignup = async () => {
    clearErrors();

    if (!displayName.trim()) {
      setDisplayNameError("Username is badly formatted.");
      return;
    } else if (!validateEmail(email)) {
      setEmailError("Email is invalid or already taken.");
      return;
    } else if (!password) {
      setPasswordError("Password is badly formatted.");
      return;
    } else if (password.length < 6) {
      setPasswordError("Password is too low (minimum is 6 characters).");
      return;
    } else if (fileList.length === 0) {
      setImageError("Avatar is badly formatted.");
      return;
    }

    const uploadTask = storage.ref(`users/avt/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setIsProgressVisible(true);

        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setProgressPercent(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("users/avt")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                const { additionalUserInfo, user } = userCredential;

                if (additionalUserInfo?.isNewUser) {
                  return addDocument("users", {
                    displayName: displayName,
                    email: email,
                    photoURL: url,
                    uid: user.uid,
                    providerId: additionalUserInfo.providerId,
                    keywords: generateKeywords(displayName?.toLowerCase()),
                  });
                }
              })
              .catch((err) => {
                // eslint-disable-next-line default-case
                switch (err.code) {
                  case "auth/email-already-in-use":
                  case "auth/invalid-email":
                    setEmailError(err.message);
                    break;
                  case "auth/weak-password":
                    setPasswordError(err.message);
                    break;
                }
              });
          });
      }
    );
  };

  return (
    <Form name="login-form" className="login-form">
      <Form.Item>
        <Input
          autoFocus
          onChange={(e) => setDisplayName(e.target.value)}
          name="displayName"
          bordered={false}
          placeholder="Username"
        />
        {displayNameError ? (
          <Typography.Text className="msgError">
            {displayNameError}
          </Typography.Text>
        ) : (
          ""
        )}
      </Form.Item>
      <Form.Item>
        <Input
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
          placeholder="Password"
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
        <>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleUploadImage}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </>
        {imageError ? (
          <Typography.Text className="msgError">{imageError}</Typography.Text>
        ) : (
          ""
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          onClick={handleSignup}
        >
          Sign Up
        </Button>
        <Button
          type="text"
          className="btn-link"
          onClick={() => setHasAccount(!hasAccount)}
        >
          <p>
            <span>Log In</span>
          </p>
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
