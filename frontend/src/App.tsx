import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash/Splash";
import Onboarding from "./pages/Onboarding/Onboarding";
import CreatingMeeting from "./pages/CreatingMeeting/CreatingMeeting";
import EditMeeting from  "./pages/EditMeeting/EditMeeting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/creating-meeting" element={<CreatingMeeting />} />
        <Route path="/edit-meeting/id" element={<EditMeeting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;