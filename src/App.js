import { BrowserRouter, Switch, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import AuthProvider from "./context/AuthProvider";
import AppProvider from "./context/AppProvider";
import AddRoomModals from "./components/Modals/AddRoomModals";
import InviteMemberModal from "./components/Modals/InviteMemberModal";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Switch>
            <Route path="/" exact component={ChatRoomPage} />
            <Route path="/login" component={LoginPage} />
          </Switch>
          <AddRoomModals />
          <InviteMemberModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
