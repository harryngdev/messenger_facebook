import React, { useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFireStore from "../hooks/useFirestore";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [progressPercentRoom, setProgressPercentRoom] = useState(0);
  const [isProgressRoomVisible, setIsProgressRoomVisible] = useState(false);

  const {
    user: { uid },
  } = React.useContext(AuthContext);

  /**
   * rooms {
   *  name: 'room name',
   *  description: 'mo ta',
   *  members: [uid1, uid2, etc...]
   * }
   */
  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains", // array members có chứa giá trị so sánh ở compareValue
      compareValue: uid,
    };
  }, [uid]);

  const rooms = useFireStore("rooms", roomsCondition);

  const selectedRoom = React.useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );

  const usersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const members = useFireStore("users", usersCondition);

  const clearState = () => {
    setSelectedRoomId("");
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
  };
  // console.log({ rooms });
  return (
    /**
     * Mọi App ở tron AppProvider đều có thể truy suất được value
     */
    <AppContext.Provider
      value={{
        rooms,
        members,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        selectedRoom,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        clearState,
        progressPercentRoom,
        setProgressPercentRoom,
        isProgressRoomVisible,
        setIsProgressRoomVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
