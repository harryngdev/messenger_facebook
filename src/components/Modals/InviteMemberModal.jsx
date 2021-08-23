import React, { useState } from "react";
import { Modal, Form, Select, Spin, Avatar } from "antd";
import { AppContext } from "../../context/AppProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/config";

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

const InviteMemberModal = () => {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomId,
    selectedRoom,
  } = React.useContext(AppContext);
  const [value, setValue] = useState([]);
  const [form] = Form.useForm(); // ReactHooks

  const handleOk = () => {
    /**
     * reset form value
     */
    form.resetFields();
    setValue([]);

    /**
     * handle logic
     * update members in current rooms
     */
    const roomRef = db.collection("rooms").doc(selectedRoomId);

    roomRef.update({
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });

    setIsInviteMemberVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setValue([]);

    setIsInviteMemberVisible(false);
  };

  return (
    <div>
      <Modal
        title="Thêm thành viên"
        visible={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          {/* Tìm kiếm người dùng trên db */}
          <DebounceSelect
            mode="multiple"
            name="search-user"
            label="Tên các thành viên"
            value={value}
            placeholder="Nhập tên các thành viên"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            currentMembers={selectedRoom.members}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default InviteMemberModal;
