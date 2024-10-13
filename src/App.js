import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Category from "./components/Category";
import Page3 from "./components/Page3";
import Mark from "./components/Mark";

/*
  "proxy": "https://aktuelapi-production.up.railway.app",
  "proxy": "http://localhost:8080",
*/

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/category" element={<Category />} />
       <Route path="/page3" element={<Page3 />} />
       <Route path="/mark" element={<Mark />} />
      </Routes>
    </Router>
  );
};

export default App;