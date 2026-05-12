import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

import InstallPWA from "./components/PWA/InstallPWA";

function App() {
  useEffect(() => {
    document.title = "Orgino Group Plataform";
  }, []);

  return (
    <>
      <AppRoutes />
      <InstallPWA />
    </>
  );
}

export default App;
