import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "../pages/Splash/Splash";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Verifyotp from "../pages/Auth/Verifyotp";
import CreateNewPassword from "../pages/Auth/CreateNewPassword";
import Onboarding from "../pages/Onboarding/Onboarding";

import Home from "../pages/Home/Home";
import CreatingMeeting from "../pages/CreatingMeeting/CreatingMeeting";
import EditMeeting from "../pages/EditMeeting/EditMeeting";
import Profile from "../pages/Profile/Profile";
import Notification from "../pages/Notification/Notification"
import Terms from "../pages/Terms/Terms";
import RateUs from "../pages/RateUs/RateUs";
import Settings from "../pages/Settings/Settings";
import ChangeName from "../pages/ChangeName/ChangeName";
import MainLayout from "../layouts/MainLayout";

import ChangePasswordOtp from "../pages/ChangePasswordOtp/ChangePasswordOtp";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>


        {/* Authentication Screens */}

        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<Verifyotp />} />
        <Route
          path="/create-new-password"
          element={<CreateNewPassword />}
        />

        {/* Main App Screens */}
        <Route
          path="/notification"
          element={<Notification />}
           />

        <Route element={<MainLayout />}>

          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/create-meeting"
            element={<CreatingMeeting />}
          />

          <Route
            path="/edit-meeting/:id"
            element={<EditMeeting />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route path="/settings" element={<Settings />} />

<Route
  path="/change-name"
  element={<ChangeName />}
/>

<Route
  path="/change-password-otp"
  element={<ChangePasswordOtp />}
/>

          <Route 
           path="/Terms"
           element={<Terms />}
           />


          <Route
           path="/RateUs"
           element={<RateUs />}
           />

          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;