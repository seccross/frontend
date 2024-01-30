import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import GlobalProvider from "./store/GlobalProvider";
function App() {
  const router = useRoutes(routes);
  return <div className="App">
    <GlobalProvider >
      
    {router}

    </GlobalProvider>
   </div>;
}

export default App;
