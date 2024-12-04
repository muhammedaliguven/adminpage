import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Category from "./components/Category";
import Brochure from "./components/Brochure";
import Mark from "./components/Mark";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<Layout />}>
          <Route path="category" element={<Category />} />
          <Route path="brochure" element={<Brochure />} />
          <Route path="mark" element={<Mark />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
