import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "context/AuthProvider";
import { ReactComponent as HangupIcon } from "assets/icons/hangup-icon.svg";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { Tooltip, Avatar } from "antd";
import { db, pc } from "firebase/config";

const PopupVideoChat = () => {
  const {
    isPopupVideoChat,
    setIsShowPopupVideoChat,
    joinCode,
    setJoinCode,
    currentPage,
    setCurrentPage,
    isResizePopupVideoChat,
    setIsResizePopupVideoChat,
  } = React.useContext(AppContext);

  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext);

  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(joinCode);

  const localRef = useRef();
  const remoteRef = useRef();

  const handleCancel = () => {
    setCurrentPage("home");
    setIsShowPopupVideoChat(false);
    setJoinCode("");
  };

  const setupSources = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);

    if (currentPage === "create") {
      const callDoc = db.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      setRoomId(callDoc.id);
      console.log("callDoc: ", callDoc.id);

      pc.onicecandidate = (event) => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });

      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } else if (currentPage === "join") {
      const callDoc = db.collection("calls").doc(joinCode);
      const answerCandidates = callDoc.collection("answerCandidates");
      const offerCandidates = callDoc.collection("offerCandidates");

      pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callDoc.get()).data();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });

      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }

    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
        hangUp();
      }
    };
  };

  const hangUp = async () => {
    pc.close();

    if (roomId) {
      let roomRef = db.collection("calls").doc(roomId);
      await roomRef
        .collection("answerCandidates")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      await roomRef
        .collection("offerCandidates")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });

      await roomRef.delete();
    }

    window.location.reload();
  };

  const handleResize = () => {
    setIsResizePopupVideoChat(true);
  };

  return (
    <>
      <Modal
        show={isPopupVideoChat}
        onHide={handleResize}
        className={`popup-video-chat__wrapper ${
          isResizePopupVideoChat ? "resize" : ""
        }`}
        backdrop={!isResizePopupVideoChat}
        onClick={() => setIsResizePopupVideoChat(false)}
        enforceFocus={false}
        centered
      >
        <Modal.Body>
          <div className="popup-video-chat__inner">
            {/* {!remoteRef?.current?.srcObject?.active && (
              <div className="popup-video-chat__loading">
                <Spinner animation="border" variant="success" />
              </div>
            )} */}
            <video
              ref={localRef}
              autoPlay
              playsInline
              className="local"
              muted
            />
            <video ref={remoteRef} autoPlay playsInline className="remote" />

            <div className="popup-video-chat__action">
              <Tooltip placement="topLeft" title="Copy joining code">
                <Button
                  disabled={!webcamActive}
                  className="popup-video-chat-btn btn-copy"
                  onClick={() => navigator.clipboard.writeText(roomId)}
                >
                  <CopyIcon />
                </Button>
              </Tooltip>
              <Tooltip placement="topLeft" title="Hangup">
                <Button
                  onClick={hangUp}
                  disabled={!webcamActive}
                  className="popup-video-chat-btn btn-hangup"
                >
                  <HangupIcon />
                </Button>
              </Tooltip>
            </div>

            <div className="popup-video-chat__info">
              <Avatar src={photoURL} size={48}>
                {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="info-wrapper">
                <h1 className="name">{displayName}</h1>
                <p>2 people</p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="popup-video-chat__notice-popup"
        show={isPopupVideoChat && !webcamActive}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          <h3 className="popup-video-chat__notice-popup--title">
            Turn on your camera and microphone and start the call
          </h3>
          <div className="popup-video-chat__notice-popup--action">
            <Button onClick={handleCancel} className="btn-cancel">
              Cancel
            </Button>
            <Button onClick={setupSources}>Start</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PopupVideoChat;
