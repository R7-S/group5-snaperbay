// src/index.js
// Contributors: <Your Name> (root bootstrap)
import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css"; // moved to css/ folder
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
