import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Products from "./components/Products";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/products" element={<Products />} />
        <Route path="/page2" element={<Page2 />} />
       <Route path="/page3" element={<Page3 />} />
      </Routes>
    </Router>
  );
};

export default App;