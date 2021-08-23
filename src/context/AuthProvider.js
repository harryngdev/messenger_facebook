import React, { useState } from "react";
import { useHistory } from "react-router";
import { auth, db } from "./../firebase/config";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styled from "styled-components";

/**
 * Dùng tất cả các thông tin của user đã đăng nhập thành công vào toàn bộ components.
 * ContextAPI (không cần truyền dữ liệu qua các props cha sang con, khai báo trong Provider).
 * => Các components con khai báo trong Provider đều nhận được dữ liệu (tương tự Redux)
 */
export const AuthContext = React.createContext();

const SpinStyled = styled(Spin)`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  .anticon {
    font-size: 50px;
  }
`;

export default function AuthProvider({ children }) {
  /**
   * children => App (Bọc Provider bên ngoài App)
   */
  const [user, setUser] = useState({});
  const [displayNameTmp, setDisplayTmp] = useState("");
  const [photoURLTmp, setPhotoURLTmp] = useState("");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        /**
         * Dùng cho trường hợp người dùng sử dụng signInWithEmailAndPassword:
         * - userCredential chỉ không có displayName và photoURL
         * - Gọi lên database để lấy giá trị về
         */
        if (displayName === null && photoURL === null) {
          db.collection("users")
            .where("uid", "==", uid)
            .onSnapshot((snapshot) => {
              const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));

              setDisplayTmp(documents[0].displayName);
              setPhotoURLTmp(documents[0].photoURL);
            });
        }

        setUser({
          displayName: displayName !== null ? displayName : displayNameTmp,
          email,
          uid,
          photoURL: photoURL !== null ? photoURL : photoURLTmp,
        });
        setIsLoading(false);
        history.push("/");
        return;
      }

      /**
       * Reset user info
       */
      setUser({});
      setIsLoading(false);
      history.push("/login");
    });

    /**
     * clean function
     */
    return () => {
      unsubscribe();
    };
  }, [history, displayNameTmp, photoURLTmp]);
  // console.log({ user });
  return (
    /**
     * AuthContext.Provider: Cách sử dụng ContextAPI trong React.
     * Provider nhận vào 1 props value là user.
     * => Các components con đều có thể truy xuất được đến dữ liệu này
     */
    <AuthContext.Provider value={{ user }}>
      {isLoading ? (
        <SpinStyled indicator={<LoadingOutlined />} size="large" />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
