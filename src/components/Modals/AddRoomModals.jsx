import React, { useState } from "react";
import { Modal, Form, Input, Typography, Upload } from "antd";
import { AppContext } from "../../context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../context/AuthProvider";
import { storage } from "../../firebase/config";
import getBase64 from "./../../utils/getBase64";
import { PlusOutlined } from "@ant-design/icons";

const AddRoomModals = () => {
  const {
    isAddRoomVisible,
    setIsAddRoomVisible,
    setProgressPercentRoom,
    setIsProgressRoomVisible,
  } = React.useContext(AppContext);
  const {
    user: { uid },
  } = React.useContext(AuthContext);
  const [form] = Form.useForm(); // ReactHooks

  const [nameError, setNameError] = useState("");
  const [discriptionError, setDescriptionError] = useState("");

  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleImgCancel = () => {
    setPreviewVisible(false);
  };

  const handleImgPreview = async (file) => {
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
        Upload
      </div>
    </div>
  );

  const handleOk = () => {
    /**
     * handle logic
     * add new room to firestore
     */
    if (
      form.getFieldValue().name === undefined ||
      form.getFieldValue().name.trim().length < 1
    ) {
      setNameError("Please enter this field");
      return;
    } else if (
      form.getFieldValue().description === undefined ||
      form.getFieldValue().description.trim().length < 1
    ) {
      setDescriptionError("Please enter this field");
      return;
    } else if (fileList.length === 0) {
      setImageError("Please upload this field");
      return;
    }

    const uploadTask = storage.ref(`rooms/avt/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setIsProgressRoomVisible(true);

        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setProgressPercentRoom(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("rooms/avt")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            const valueRoom = {
              ...form.getFieldValue(),
              name: form.getFieldValue().name.trim(),
              description: form.getFieldValue().description.trim(),
              backgroundURL: url,
              creator: uid,
              type: "roomchat",
            };

            addDocument("rooms", { ...valueRoom, members: [uid] });

            /**
             * reset form value
             */
            handleCancel();

            setIsProgressRoomVisible(false);
            setProgressPercentRoom(0);
          });
      }
    );
  };

  const handleCancel = () => {
    form.resetFields();
    setNameError("");
    setDescriptionError("");
    setImageError("");
    setFileList([]);
    setImage(null);
    setIsAddRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title="New Group"
        visible={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Group Name" name="name">
            <Input placeholder="Group Name" />
          </Form.Item>
          <Typography.Text className="msgError">{nameError}</Typography.Text>
          <Form.Item label="Group Description" name="description">
            <Input.TextArea placeholder="Group Description" />
          </Form.Item>
          <Typography.Text className="msgError">
            {discriptionError}
          </Typography.Text>
          <Form.Item label="Chat Photo">
            <>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handleImgPreview}
                onChange={handleUploadImage}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>

              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleImgCancel}
              >
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </>
          </Form.Item>
          <Typography.Text className="msgError">{imageError}</Typography.Text>
        </Form>
      </Modal>
    </div>
  );
};

export default AddRoomModals;
