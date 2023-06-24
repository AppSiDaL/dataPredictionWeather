import "./Stats.css";
import React, { useState, useEffect } from "react";
import tesjoLogo from "./assets/tesjoLogo.png";
import Navbar from "./Navbar";

import sunriseImage from "./assets/sunrise.jpg";

import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
export default function Stats() {
  const mainIcon = React.createElement(FontAwesomeIcon, {
    icon: faCloudSun,
    beat: true,
    style: { animationDuration: "5s", color: "white", fontSize: "1000%" },
  });
  const cloudSun = React.createElement(FontAwesomeIcon, {
    icon: faCloudSun,
    beat: true,
    style: { animationDuration: "5s", color: "black", fontSize: "400%" },
  });
  const [currentValues, setCurrentValues] = useState({});
  useEffect(() => {
    axios
      .get("http://172.26.64.173/clima/getCurrentValues.php")
      .then(function (response) {
        const datos = {};
        const nombres = [
          "fecha",
          "hora",
          "minuto",
          "direccion",
          "humedad",
          "lluvia",
          "luz",
          "presion",
          "temperatura",
          "velocidad",
          "minTemperatura",
          "maxTemperatura",
          "avgTemperatura"
        ];
        for (let i = 0; i <= nombres.length - 1; i++) {
          const indice = nombres[i];
          const data = response.data[0][indice];
          datos[indice] = data;
        }
        setCurrentValues(datos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentValues]);

  var abreviatura="am";
  if (currentValues["hora"]>12) {
    abreviatura="pm";
  }

  function getPeriod() {
  
    if (currentValues["hora"] >= 6 && currentValues["hora"] < 12) {
      return 'Mañana';
    } else if (currentValues["hora"] >= 12 && currentValues["hora"] < 18) {
      return 'Tarde';
    } else if (currentValues["hora"] >= 18 && currentValues["hora"] < 24) {
      return 'Noche';
    } else {
      return 'Madrugada';
    }
  }

  return (
    <>
      <div className="header">
        <img src={tesjoLogo} />
        <h1>TESJO CLIMA</h1>
      </div>
      <Navbar />
      <div className="cards">
        <div
          className="card"
          style={{ backgroundImage: `url(${sunriseImage})` }}
        >
          <div className="cardHeader">
            <p>TESJo A partir de las {currentValues["hora"]} {abreviatura}</p>
          </div>
          <div className="cardBody">
            <div>
              <h1>{currentValues["temperatura"]} °</h1>
              <p>Soleado*</p>
              <p>Dia {currentValues["maxTemperatura"]} Noche {currentValues["minTemperatura"]}</p>
            </div>
            <div className="icon">{mainIcon}</div>
          </div>
        </div>
        <div className="card2">
          <div className="cardHeader2">
            <p>Pronostico para hoy</p>
          </div>
          <div className="cardBody2">
          <div className={`cardData ${getPeriod() === 'Mañana' ? 'highlight' : ''}`}>
              <p>Mañana</p>
              <h1>{getPeriod() === 'Mañana' ? currentValues["temperatura"] : '12'}</h1>
              {cloudSun}
              <p>---*</p>
            </div>
            <div className="cardData">
              <p>Tarde</p>
              <h1>{getPeriod() === 'Tarde' ? currentValues["temperatura"] : '12'}</h1>
              {cloudSun}
              <p>---*</p>
            </div>
            <div className="cardData">
              <p>Noche</p>
              <h1>{getPeriod() === 'Noche' ? currentValues["temperatura"] : '12'}</h1>
              {cloudSun}
              <p>---*</p>
            </div>
            <div className="cardData">
              <p>Madrugada</p>
              <h1>{getPeriod() === 'Madrugada' ? currentValues["temperatura"] : '12'}</h1>
              {cloudSun}
              <p>---*</p>
            </div>
          </div>
        </div>
        <div className="card3">
          <div className="cardHeader3">
            <p>El tiempo en el TESJo</p>
          </div>
          <div className="cardTop3">
            <h1>{currentValues["temperatura"]} °</h1>
            <p>Sensacion Termica</p>
          </div>
          <div className="cardBody3">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{display:"flex"}}>
                {cloudSun}
                <p>Max.Min</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["maxTemperatura"]}/{currentValues["minTemperatura"]}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{display:"flex"}}>
                {cloudSun}
                <p>Humedad</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["humedad"]}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{display:"flex"}}>
                {cloudSun}
                <p>Direccion</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["direccion"]}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{display:"flex"}}>
                {cloudSun}
                <p>Lluvia</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["lluvia"]}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{display:"flex"}}>
                {cloudSun}
                <p>Luz</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["luz"]}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{display:"flex"}}>
                {cloudSun}
                <p>Presion</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["presion"]}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{display:"flex"}}>
                {cloudSun}
                <p>Velocidad</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["velocidad"]}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card4">
          <div className="cardHeader4">
            <p>Pronostico Hora</p>
          </div>
          <div className="cardBody4">
            <div>
              <p>Ahora</p>
              <p>{currentValues["temperatura"]}</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div>
              <p>{currentValues["hora"]+1+":00"}</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div>
              <p>{currentValues["hora"]+2+":00"}</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div>
              <p>{currentValues["hora"]+3+":00"}</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div>
              <p>{currentValues["hora"]+4+":00"}</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
          </div>
        </div>
        <div className="card4">
          <div className="cardHeader4">
            <p>Pronostico Diario</p>
          </div>
          <div className="cardBody4">
            <div>
              <p>Ahora</p>
              <p>{currentValues["avgTemperatura"]}</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div>
              <p>Ahora</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div>
              <p>Ahora</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div>
              <p>Ahora</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div>
              <p>Ahora</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
