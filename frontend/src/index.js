import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { FlightProvider } from "./components/FlightContext";

ReactDOM.render(
  <React.StrictMode>
    <FlightProvider>
      <App />
    </FlightProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
