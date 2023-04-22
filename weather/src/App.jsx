import "./App.css";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import {Link} from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { faCompass, faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudMoon,
  faCloudMoonRain,
  faCloudSun,
  faCloudSunRain,
  faWater,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { faCloudscale } from "@fortawesome/free-brands-svg-icons";
import Data from "./Data";
function App() {
  var today = new Date();
  var time = today.getHours();
  var now = today.toLocaleString();

  var temporal = new Date();

  temporal.setHours(6, 0, 0);
  var amanecerTime = temporal.getHours();

  temporal.setHours(10, 0, 0);
  var diaTime = temporal.getHours();

  temporal.setHours(17, 0, 0);
  var atardecerTime = temporal.getHours();

  temporal.setHours(20, 0, 0);
  var anochecerTime = temporal.getHours();

  var hora;
  var tiempo;
  time = today.getHours();

  if (time >= amanecerTime) {
    hora = "app-sunrise";
    tiempo = "Amanecer";
  }
  if (time >= diaTime) {
    hora = "app-day";
    tiempo = "Dia";
  }
  if (time >= atardecerTime) {
    hora = "app-sunset";
    tiempo = "Atardecer";
  }
  if (time >= anochecerTime) {
    hora = "app-night";
    tiempo = "Noche";
  }
  function fixHour(hour) {
    var system;

    if (hour > 12) {
      hour = hour - 12;
      system = "pm";
    } else {
      system = "am";
    }

    if (hour >= 13) {
      hour = hour - 12;
      if (hour > 12) {
        system = "pm";
      } else {
        system = "am";
      }
    }
    return hour + ":00 " + system;
  }
  const sunny = React.createElement(FontAwesomeIcon, {
    icon: faSun,
    spin: true,
    style: { animationDuration: "5s", color: "yellow" },
    size: "2xl",
  });
  const cloudSun = React.createElement(FontAwesomeIcon, {
    icon: faCloudSun,
    beat: true,
    style: { animationDuration: "5s", color: "white" },
    size: "2xl",
  });
  const cloudMoon = React.createElement(FontAwesomeIcon, {
    icon: faCloudMoon,
    beat: true,
    style: { animationDuration: "5s", color: "white" },
    size: "2xl",
  });
  const cloudSunRain = React.createElement(FontAwesomeIcon, {
    icon: faCloudSunRain,
    beatFade: true,
    style: { animationDuration: "5s", color: "black" },
    size: "2xl",
  });
  const cloudMoonRain = React.createElement(FontAwesomeIcon, {
    icon: faCloudMoonRain,
    beat: true,
    style: { animationDuration: "5s", color: "gray" },
    size: "2xl",
  });

  const moon = React.createElement(FontAwesomeIcon, {
    icon: faMoon,
    beat: true,
    style: { animationDuration: "5s", color: "yellow" },
    size: "2xl",
  });

  const droplet = React.createElement(FontAwesomeIcon, {
    icon: faDroplet,
    bounce: true,
    style: { animationDuration: "2s", color: "#00BDFF" },
    size: "5x",
  });
  const water = React.createElement(FontAwesomeIcon, {
    icon: faWater,
    shake: true,
    style: { animationDuration: "5s", color: "#00BDFF" },
    size: "5x",
  });
  const lightBulb = React.createElement(FontAwesomeIcon, {
    icon: faLightbulb,
    fade: true,
    style: { animationDuration: "2s", color: "yellow" },
    size: "5x",
  });
  const scale = React.createElement(FontAwesomeIcon, {
    icon: faCloudscale,
    spin: true,
    style: { animationDuration: "10s", color: "gray" },
    size: "5x",
  });
  const wind = React.createElement(FontAwesomeIcon, {
    icon: faWind,
    beatFade: true,
    style: { animationDuration: "2s", color: "white" },
    size: "5x",
  });
  const compass = React.createElement(FontAwesomeIcon, {
    icon: faCompass,
    spin: true,
    style: { animationDuration: "5s", color: "gray" },
    size: "5x",
  });
  var weatherIcon;

  temporal = new Date();
  var horas = temporal.getHours();
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  function getDayWeek(plus) {
    var dayOfWeek;
    var realDay = temporal.getDay();
    var dia = realDay + plus;
    if (dia >= 7) {
      realDay = 0;
    }
    dia = realDay + plus;
    dayOfWeek = days[dia];
    return dayOfWeek;
  }
  function getDate(plus) {
    var currentDate = new Date();
    var realDay = new Date(currentDate.setDate(currentDate.getDate() + plus));
    return realDay.toLocaleDateString(realDay.getDate());
  }
  const options = {
    elements: {
      point: {
        radius: 7,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Temperatura Minima y Maxima",
      },
    },
    animations: {
      tension: {
        duration: 2000,
        easing: "easeInBack",
        from: 1,
        to: 0,
        loop: true,
      },
    },
  };
  const [valores, setvalores] = useState([]);
  const [temperaturas, setTemperaturas] = useState([]);
  const [lluvias, setlluvias] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost/weatherStation/obtain.php")
      .then(function (response) {
        const datos = [];
        const nombres = [
          "time",
          "type",
          "direction",
          "humidity",
          "rain",
          "ligth",
          "pressure",
          "tempeture",
          "speed",
          "probabilidad",
        ];
        for (let i = 0; i <= nombres.length; i++) {
          var indice = nombres[i];
          const data = response.data[0][indice];
          datos.push(data);
        }
        setvalores(datos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost/weatherStation/getNextLluvias.php")
      .then(function (response) {
        const nuevasLluvias = [];
        for (let i = 1; i <= 23; i++) {
          const lluvia = response.data[i - 1].probabilidad;
          nuevasLluvias.push(lluvia);
        }
        setlluvias(nuevasLluvias);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/weatherStation/getNextHours.php")
      .then(function (response) {
        const nuevasTemperaturas = [];
        for (let i = 1; i <= 23; i++) {
          const temperatura = response.data[i - 1].tempeture;
          nuevasTemperaturas.push(temperatura);
        }
        setTemperaturas(nuevasTemperaturas);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function setIcon(probabilidad) {
    if (probabilidad >= 40 && probabilidad < 70 && tiempo !== "Noche") {
      weatherIcon = cloudSun;
    } else if (probabilidad > 40 && probabilidad > 70 && tiempo !== "Noche") {
      weatherIcon = cloudSunRain;
    } else if (probabilidad > 40 && probabilidad < 70 && tiempo === "Noche") {
      weatherIcon = cloudMoon;
    } else if (probabilidad > 40 && probabilidad > 70 && tiempo === "Noche") {
      weatherIcon = cloudMoonRain;
    } else if (probabilidad <= 40 && tiempo !== "Noche") {
      weatherIcon = sunny;
    } else {
      weatherIcon = moon;
    }

    return weatherIcon;
  }

  return (
    <div className={hora}>
      <h3 className="city">TESJo</h3>
      <p>{now}</p>
      <p className="temperatura">{valores[7] + "º"}</p>
      <p className="clima">{tiempo}</p>
      <div className="grid-container">
        <div>
          <p className="climaValue">{temperaturas[0] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[0])}</p>
          <p className="climaValue">{lluvias[0] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 1)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[1] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[1])}</p>
          <p className="climaValue">{lluvias[1] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 2)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[2] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[2])}</p>
          <p className="climaValue">{lluvias[2] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 3)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[3] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[3])}</p>
          <p className="climaValue">{lluvias[3] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 4)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[4] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[4])}</p>
          <p className="climaValue">{lluvias[4] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 5)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[5] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[5])}</p>
          <p className="climaValue">{lluvias[5] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 6)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[6] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[6])}</p>
          <p className="climaValue">{lluvias[6] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 7)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[7] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[7])}</p>
          <p className="climaValue">{lluvias[7] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 8)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[8] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[8])}</p>
          <p className="climaValue">{lluvias[8] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 9)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[9] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[9])}</p>
          <p className="climaValue">{lluvias[9] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 10)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[10] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[10])}</p>
          <p className="climaValue">{lluvias[10] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 11)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[11] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[11])}</p>
          <p className="climaValue">{lluvias[11] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 12)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[12] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[12])}</p>
          <p className="climaValue">{lluvias[12] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 13)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[13] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[13])}</p>
          <p className="climaValue">{lluvias[13] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 14)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[14] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[14])}</p>
          <p className="climaValue">{lluvias[14] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 15)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[15] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[15])}</p>
          <p className="climaValue">{lluvias[15] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 16)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[16] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[16])}</p>
          <p className="climaValue">{lluvias[16] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 17)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[17] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[17])}</p>
          <p className="climaValue">{lluvias[17] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 18)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[18] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[18])}</p>
          <p className="climaValue">{lluvias[18] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 19)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[19] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[19])}</p>
          <p className="climaValue">{lluvias[19] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 20)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[20] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[20])}</p>
          <p className="climaValue">{lluvias[20] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 21)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[21] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[21])}</p>
          <p className="climaValue">{lluvias[21] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 22)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[22] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[22])}</p>
          <p className="climaValue">{lluvias[22] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 23)}</p>
        </div>
        <div>
          <p className="climaValue">{temperaturas[23] + "º C"}</p>
          <p className="climaIcon">{setIcon(lluvias[23])}</p>
          <p className="climaValue">{lluvias[23] + "%"}</p>
          <p className="climaHour"> {fixHour(horas + 24)}</p>
        </div>
      </div>
      <div className="grid-container-days">
        <div className="climaIcon">
          {" "}
          <p>{getDayWeek(0)}</p>
          <p>{getDate(0)}</p>
          <p>{sunny}</p>
          <p>21/5</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(1)}</p>
          <p>{getDate(1)}</p>
          <p>{sunny}</p>
          <p>25/3</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(2)}</p>
          <p>{getDate(2)}</p>
          <p>{sunny}</p>
          <p>26/10</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(3)}</p>
          <p>{getDate(3)}</p>
          <p>{sunny}</p>
          <p>25/8</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(4)}</p>
          <p>{getDate(4)}</p>
          <p>{sunny}</p>
          <p>27/6</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(5)}</p>
          <p>{getDate(5)}</p>
          <p>{sunny}</p>
          <p>22/2</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(6)}</p>
          <p>{getDate(6)}</p>
          <p>{sunny}</p>
          <p>29/11</p>
        </div>
      </div>
      <div className="clima-chart">
        <Line
          datasetIdKey="id"
          data={{
            labels: ["1", "2", "3", "4", "5", "6", "7"],
            datasets: [
              {
                id: 1,
                label: "Max",
                data: [21, 24, 27, 20, 25, 30, 25],
                borderColor: "WHITE",
                backgroundColor: "gray",
              },
              {
                id: 2,
                label: "Min",
                data: [7, 5, 1, 2, 5, 9, 5],
                borderColor: "WHITE",
                backgroundColor: "gray",
              },
            ],
          }}
          options={options}
        />
      </div>
      <h4>CONFORT</h4>{" "}
      <div className="confort">
        <div>
          <p>Humedad</p>
          {water}
          <p>{valores[3]} %</p>
        </div>
        <div>
          {" "}
          <p>Lluvia</p>
          {droplet}
          <p>{valores[4]} cm3</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Luz</p>
          {lightBulb}
          <p>{valores[5]} Lx</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Presion</p>
          {scale}
          <p>{valores[6]} var</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Velocidad Viento</p>
          {wind}
          <p>{valores[8]} km/h</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Direccion</p>
          {compass}
          <p>{valores[2]} º</p>
        </div>
      </div>
      <div>La ultima respuesta del servidor fue a las:{" " + valores[0]}</div>
      <Link to="Data">Data</Link>
      <Link to="/">Data</Link>
      <Routes>
      <Route path="Data" element={<Data />} />
      <Route path="/" element={<App />} />
      

      </Routes>
    </div>
  );
}

export default App;
