import React, { useState } from "react";
import { Modal, Form, Select, Spin, Avatar } from "antd";
import { AppContext } from "../../context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../context/AuthProvider";

import { debounce } from "lodash";
import { db } from "../../firebase/config";
import firebase from "./../../firebase/config";

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 300,
  currentMembers,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, currentMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, currentMembers]);

  React.useEffect(() => {
    return () => {
      /**
       * Clear when unmount
       */
      setOptions([]);
    };
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {/* [{ label: , value, photoURL }] */}
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL}>
            {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

async function fetchUserList(search, currentMembers) {
  return db
    .collection("users")
    .where("keywords", "array-contains", search?.toLowerCase())
    .orderBy("displayName")
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        }))
        .filter((opt) => !currentMembers.includes(opt.value));
    });
}

const AddMessageModals = () => {
  const { isNewMessageVisible, setIsNewMessageVisible, messages } =
    React.useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = React.useContext(AuthContext);
  const [value, setValue] = useState([]);
  const [form] = Form.useForm(); // ReactHooks

  const handleOk = () => {
    /**
     * handle logic
     */
    if (value.value) {
      const { label } = value;
      const valueMessage = {
        name: [displayName, label[1]],
        description: firebase.firestore.FieldValue.serverTimestamp(),
        backgroundURL: [photoURL, label[0].props.src],
        creator: uid,
        type: "message",
        members: [uid, value.value],
      };
      addDocument("rooms", { ...valueMessage });
    }

    /**
     * reset form value
     */
    form.resetFields();
    setValue([]);
    setIsNewMessageVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setValue([]);

    setIsNewMessageVisible(false);
  };

  const handleCurrentMembers = () => {
    let tmp1 = [uid];
    let tmp2 = messages.reduce((a, b) => {
      return a.concat(b.members);
    }, []);
    let result = [];
    result = result.concat(tmp1);
    result = result.concat(tmp2);
    return [...new Set(result)];
  };

  return (
    <div>
      <Modal
        title="New Message"
        visible={isNewMessageVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
        centered
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            showSearch
            name="search-user"
            value={value}
            placeholder="To:"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            currentMembers={handleCurrentMembers()}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default AddMessageModals;
