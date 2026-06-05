import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./pages/auth/SignIn";
import VerifyEmail from "./pages/auth/VerifyEmail";
import SignUp from "./pages/auth/SignUp";
import FindingNickname from "./pages/auth/FindingNickname";
import ResetPassword from "./pages/auth/ResetPassoword";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" replace/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/verify" element={<VerifyEmail/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/find-nickname" element={<FindingNickname/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/main" element={<MainPage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
