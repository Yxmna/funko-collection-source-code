import { createRoot } from 'react-dom/client';
import "./styles/index.scss";
import {  BrowserRouter, Routes, Route } from "react-router-dom";

const version = "2.0";
console.log("v" + version);

const container = document.getElementById("root");
const root = createRoot(container);

import App from "./App";

root.render(
  <App />
)
