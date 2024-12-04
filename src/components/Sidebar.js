import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h3>Menü</h3>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <Link to="/app/brochure">Brochure</Link>
        </li>
        <li style={styles.li}>
          <Link to="/app/category">Category</Link>
        </li>
        <li style={styles.li}>
          <Link to="/app/mark">Mark</Link>
        </li>
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "15px",
    position: "fixed",
    top: 0,
    left: 0,
  },
  ul: {
    listStyleType: "none",
    padding: 0,
  },
  li: {
    margin: "10px 0",
  },
};

export default Sidebar;
