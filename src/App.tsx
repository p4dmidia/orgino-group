import React from "react";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

import InstallPWA from "./components/PWA/InstallPWA";

function App() {
  return (
    <>
      <AppRoutes />
      <InstallPWA />
    </>
  );
}

export default App;
