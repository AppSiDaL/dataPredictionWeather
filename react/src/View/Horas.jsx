import React from "react";
import Navbar from "./Navbar";
export default function Horas() {
  return (
    <>
      <Navbar />
      <div className="card">
        <div className="cardBody">
          <div>
            <h1> °</h1>
            <p>Soleado*</p>
            <p>Dia</p>
          </div>
          <div className="icon"></div>
        </div>
      </div>
    </>
  );
}
