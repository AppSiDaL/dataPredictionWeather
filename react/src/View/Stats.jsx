import "./Stats.css";
import React, { useState, useEffect } from "react";
import tesjoLogo from "./assets/tesjoLogo.png";
import Navbar from "./Navbar";

import sunriseImage from "./assets/sunrise.jpg";
import sunyImage from "./assets/sunny.jpeg";
import nightImage from "./assets/night.png";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import { faTemperatureLow } from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { faUmbrella } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faArrowsDownToLine } from "@fortawesome/free-solid-svg-icons";
import { faWind } from "@fortawesome/free-solid-svg-icons";
export default function Stats() {
  const cloudSun = React.createElement(FontAwesomeIcon, {
    icon: faCloudSun,
    style: { color: "black", fontSize: "400%" },
  });

  const temperature = React.createElement(FontAwesomeIcon, {
    icon: faTemperatureLow,
    style: { color: "#D91A21", fontSize: "250%" },
  });

  const droplet = React.createElement(FontAwesomeIcon, {
    icon: faDroplet,
    style: { color: "#2A6ED9", fontSize: "250%" },
  });

  const compass = React.createElement(FontAwesomeIcon, {
    icon: faCompass,
    style: { color: "GRAY", fontSize: "250%" },
  });

  const umbrella = React.createElement(FontAwesomeIcon, {
    icon: faUmbrella,
    style: { color: "#D9ADC0", fontSize: "250%" },
  });

  const lightBulb = React.createElement(FontAwesomeIcon, {
    icon: faLightbulb,
    style: { color: "#D9C62A", fontSize: "250%" },
  });

  const pressure = React.createElement(FontAwesomeIcon, {
    icon: faArrowsDownToLine,
    style: { color: "black", fontSize: "250%" },
  });

  const wind = React.createElement(FontAwesomeIcon, {
    icon: faWind,
    style: { color: "#B6CDD9", fontSize: "250%" },
  });

  const [currentValues, setCurrentValues] = useState({});
  useEffect(() => {
    axios
      .get("https://tesjo-clima-api.onrender.com/api/currentValues")
      .then(function (response) {
        console.log(response.data)
        const datos = [];
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
          "avgTemperatura",
          "estadoClima",
        ];
        for (let i = 0; i <= nombres.length - 1; i++) {
          const indice = nombres[i];
          const data = response.data[indice];
          datos[indice] = data;
        }
        setCurrentValues(datos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentValues]);

  const [next48values, setNext48values] = useState({});
  useEffect(() => {
    axios
      .get("http://172.26.64.173/clima/getNextValues48.php")
      .then(function (response) {
        setNext48values(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [next48values]);

  var abreviatura = "am";
  if (currentValues["hora"] > 12) {
    abreviatura = "pm";
  }
  var ambiente;
  var backgroundColor = "#f5d0a8";
  var backgroundImage = nightImage;
  function getPeriod() {
    if (currentValues["hora"] >= 6 && currentValues["hora"] < 12) {
      ambiente = "mañana";
      backgroundColor = "#f5d0a8";
      backgroundImage = sunriseImage;
      return "Mañana";
    } else if (currentValues["hora"] >= 12 && currentValues["hora"] < 18) {
      ambiente = "tarde";
      backgroundColor = "#00aaff";
      backgroundImage = sunyImage;
      return "Tarde";
    } else if (currentValues["hora"] >= 18 && currentValues["hora"] < 24) {
      ambiente = "noche";
      backgroundColor = "#4e658d";
      backgroundImage = nightImage;
      return "Noche";
    } else {
      ambiente = "madrugada";
      backgroundColor = "#4e658d";
      backgroundImage = nightImage;
      return "Madrugada";
    }
  }
  getPeriod();

  function getCurrentIcon() {
    if (currentValues["estadoClima"] === "Soleado") {
      const mainIcon = React.createElement(FontAwesomeIcon, {
        icon: faCloudSun,
        style: { color: "white", fontSize: "1000%" },
      });
      return mainIcon;
    }
  }

  return (
    <>
      <div
        /*style={{ backgroundColor: `${backgroundColor}` }}*/ className="header"
      >
        <img src={tesjoLogo} />
        <h1>TESJO CLIMA</h1>
      </div>
      <Navbar />
      <div className="cards">
        <div
          className="card"
          style={{ backgroundImage: `url(${backgroundImage})`, color: "white" }}
        >
          <div className="cardHeader">
            <p>
              {" "}
              A partir de las {currentValues["hora"]} {abreviatura}
            </p>
          </div>
          <div className="cardBody">
            <div>
              <h1>{currentValues["temperatura"]} °</h1>
              <p>Soleado*</p>
              <p>
                Dia {currentValues["maxTemperatura"]} Noche{" "}
                {currentValues["minTemperatura"]}
              </p>
            </div>
            <div className="icon">{getCurrentIcon()}</div>
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
            <div
              className="details"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", marginLeft: "5px" }}>
                {temperature}
                <p style={{ marginLeft: "5px" }}>Max.Min</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>
                  {currentValues["maxTemperatura"]}/
                  {currentValues["minTemperatura"]}
                </p>
              </div>
            </div>
            <div
              className="details"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", marginLeft: "5px" }}>
                {droplet}
                <p style={{ marginLeft: "5px" }}>Humedad</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["humedad"]}</p>
              </div>
            </div>
            <div
              className="details"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", marginLeft: "5px" }}>
                {compass}
                <p style={{ marginLeft: "5px" }}>Direccion</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["direccion"]}</p>
              </div>
            </div>
            <div
              className="details"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", marginLeft: "5px" }}>
                {umbrella}
                <p style={{ marginLeft: "5px" }}>Lluvia</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["lluvia"]}</p>
              </div>
            </div>
            <div
              className="details"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", marginLeft: "5px" }}>
                {lightBulb}
                <p style={{ marginLeft: "5px" }}>Luz</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["luz"]}</p>
              </div>
            </div>
            <div
              className="details"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", marginLeft: "5px" }}>
                {pressure}
                <p style={{ marginLeft: "5px" }}>Presion</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["presion"]}</p>
              </div>
            </div>
            <div
              className="details"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", marginLeft: "5px" }}>
                {wind}
                <p style={{ marginLeft: "5px" }}>Velocidad</p>
              </div>
              <div>
                <p style={{ marginLeft: "0" }}>{currentValues["velocidad"]}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card2">
          <div className="cardHeader2">
            <p>Pronostico para hoy</p>
          </div>
          <div className="cardBody2">
            <div
              className={`cardData ${
                getPeriod() === "Mañana" ? "highlight" : ""
              }`}
            >
              <p>Mañana</p>
              <h1>
                {getPeriod() === "Mañana" ? currentValues["temperatura"] : "12"}
              </h1>
              {cloudSun}
              <p>---*</p>
            </div>
            <div
              className={`cardData ${
                getPeriod() === "Tarde" ? "highlight" : ""
              }`}
            >
              <p>Tarde</p>
              <h1>
                {getPeriod() === "Tarde" ? currentValues["temperatura"] : "12"}
              </h1>
              {cloudSun}
              <p>---*</p>
            </div>
            <div
              className={`cardData ${
                getPeriod() === "Noche" ? "highlight" : ""
              }`}
            >
              <p>Noche</p>
              <h1>
                {getPeriod() === "Noche" ? currentValues["temperatura"] : "12"}
              </h1>
              {cloudSun}
              <p>---*</p>
            </div>
            <div
              className={`cardData ${
                getPeriod() === "Madrugada" ? "highlight" : ""
              }`}
            >
              <p>Madrugada</p>
              <h1>
                {getPeriod() === "Madrugada"
                  ? currentValues["temperatura"]
                  : "12"}
              </h1>
              {cloudSun}
              <p>---*</p>
            </div>
          </div>
        </div>
        <div className="card4">
          <div className="cardHeader4">
            <p>Pronostico Hora</p>
          </div>
          <div className="cardBody4">
            <div className="cardDetails4">
              <p>Ahora</p>
              <p>{currentValues["temperatura"]}</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div className="cardDetails4">
              <p>
                {(currentValues["hora"] + 1 >= 24
                  ? currentValues["hora"] + 1 - 24
                  : currentValues["hora"] + 1) + ":00"}
              </p>
              <p>{next48values["average1"]}</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div className="cardDetails4">
              <p>
                {(currentValues["hora"] + 2 >= 24
                  ? currentValues["hora"] + 2 - 24
                  : currentValues["hora"] + 2) + ":00"}
              </p>
              <p>{next48values["average2"]}</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div className="cardDetails4">
              <p>
                {(currentValues["hora"] + 3 >= 24
                  ? currentValues["hora"] + 3 - 24
                  : currentValues["hora"] + 3) + ":00"}
              </p>
              <p>{next48values["average3"]}</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div className="cardDetails4">
              <p>
                {(currentValues["hora"] + 4 >= 24
                  ? currentValues["hora"] + 4 - 24
                  : currentValues["hora"] + 4) + ":00"}
              </p>
              <p>{next48values["average4"]}</p>
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
            <div className="cardDetails4">
              <p>Hoy</p>
              <p>{currentValues["avgTemperatura"]}</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div className="cardDetails4">
              <p>Martes 27</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div className="cardDetails4">
              <p>Miercoles 28</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div className="cardDetails4">
              <p>Jueves 29</p>
              <p>28</p>
              {cloudSun}
              <p>2%</p>
            </div>
            <div className="cardDetails4">
              <p>Viernes 30</p>
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
