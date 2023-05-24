import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="">
      <nav className="">
        <h1 className="">🔄 Demo App</h1>
        <div>
          <ul className="">
            <li>
              <Link to="/" className="">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/docs" className="">
                Docs
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
