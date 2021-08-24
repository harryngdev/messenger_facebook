import React from "react";
import { Avatar, Typography, Image } from "antd";
import { formatRelative } from "date-fns/esm";
import { AuthContext } from "../../context/AuthProvider";

function formatDate(seconds) {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

const Message = ({ uid, text, displayName, createdAt, photoURL, type }) => {
  const { user } = React.useContext(AuthContext);

  return (
    <div className={`message-item ${user.uid === uid ? "me" : ""}`}>
      <div className="message-item-header">
        <Typography.Text className="name">{displayName}</Typography.Text>
        <Typography.Text className="time">
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>

      <div className="message-item-content">
        <div className="avt">
          <Avatar src={photoURL} size={28}>
            {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </div>
        {type === "text" ? (
          <Typography.Text className="message">{text}</Typography.Text>
        ) : type === "sticker" ? (
          <div className="message-sticker">
            <img src={text} alt={text} />
          </div>
        ) : (
          <div className="message-image">
            <Image width={200} src={text} />
          </div>
        )}
      </div>
    </div>
  );
};

Message.propTypes = {};

export default Message;
