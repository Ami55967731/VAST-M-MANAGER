import { Outlet } from "react-router-dom";

import "./MainLayout.css";
import BottomNavigation from "../components/ButtomNavigation/ButtomNavigation";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <main className="main-content">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
}