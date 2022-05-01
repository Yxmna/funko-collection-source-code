import { createRoot } from 'react-dom/client';
import "./styles/index.scss";
import {  BrowserRouter, Routes, Route } from "react-router-dom";
const version = "1.2";
console.log("v" + version);

const container = document.getElementById("root");
const root = createRoot(container);

import Collections from "./pages/Collections";
import Graphique from "./pages/Graphique";
import Pops from "./pages/Pops";
import Header from "./components/Header";

root.render(

  <BrowserRouter>
  <Header />
  <main>
    <Routes>
    <Route path="funko-collection/" element={<Collections />} />
      <Route path="funko-collection/collection" element={<Collections />} />
      <Route path="funko-collection/tout" element={<Pops />} />
      <Route path="funko-collection/graphique" element={<Graphique />} />
    </Routes>
    </main>
  </BrowserRouter>

);
