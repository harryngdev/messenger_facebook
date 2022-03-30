import AddMessageModals from "components/Modals/AddMessageModals";
import AddRoomModals from "components/Modals/AddRoomModals";
import InviteMemberModal from "components/Modals/InviteMemberModal";
import PopupVideoChat from "components/Modals/PopupVideoChat";
import VideoChat from "components/Modals/VideoChat";
import AppProvider from "context/AppProvider";
import AuthProvider from "context/AuthProvider";
import ChatRoomPage from "pages/ChatRoomPage";
import LoginPage from "pages/LoginPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Switch>
            <Route path="/" exact component={ChatRoomPage} />
            <Route path="/login" component={LoginPage} />
          </Switch>
          <AddMessageModals />
          <AddRoomModals />
          <VideoChat />
          <PopupVideoChat />
          <InviteMemberModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
