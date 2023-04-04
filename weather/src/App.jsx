import "./App.css";
import axios from 'axios';
import React from "react";
import { faCompass, faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faCloudBolt, faCloudRain,  faWater, faWind } from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { faCloudscale } from "@fortawesome/free-brands-svg-icons";
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
  const cloud = React.createElement(FontAwesomeIcon, {
    icon: faCloud,
    beat: true,
    style: { animationDuration: "5s", color: "white" },
    size: "2xl",
  });
  const cloudRain = React.createElement(FontAwesomeIcon, {
    icon: faCloudRain,
    beat: true,
    style: { animationDuration: "5s", color: "gray" },
    size: "2xl",
  });
  const cloudBolt = React.createElement(FontAwesomeIcon, {
    icon: faCloudBolt,
    beat: true,
    style: { animationDuration: "5s", color: "black" },
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
    beatFade:true,
    style: { animationDuration: "2s", color: "white" },
    size: "5x",
  });
  const compass = React.createElement(FontAwesomeIcon, {
    icon: faCompass,
    spin: true,
    style: { animationDuration: "5s", color: "red" },
    size: "5x",
  });
  var weatherIcon=cloudRain;
  /*if (tiempo==="Noche") {
    weatherIcon=moon;
  }else{
     weatherIcon = sunny;
  }*/

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
    responsive: true,
    plugins: {
      legend: {
        display:false,
      },
      title: {
        display: true,
        text: 'Temperatura Minima y Maxima',
      },
    },
    animations: {
      tension: {
        duration: 2000,
        easing: 'easeInBack',
        from: 1,
        to: 0,
        loop: true
      }
    },
  };

  axios.get('http://localhost/weatherStation/obtain.php')
  .then(response => {
    console.log(response.data);
    const ultimaRespuesta=JSON.parse(response);
    console.log(ultimaRespuesta);
  })
  
  .catch(error => {
    console.error(error);
  });


  return (
    
    <div className={hora}>
      <h3 className="city">TESJo</h3>
      <p>{now}</p>
      <p className="temperatura">25/7º</p>
      <p className="clima">{tiempo}</p>
      <div className="grid-container">
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 1)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 2)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 3)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 4)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 5)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 6)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 7)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 8)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 9)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 10)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 11)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 12)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 13)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 14)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 15)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 16)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 17)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 18)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 19)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 20)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 21)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 22)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 23)}</p>
        </div>
        <div>
          {" "}
          <p className="climaIcon">{weatherIcon}</p>
          <p className="climaHour"> {fixHour(horas + 24)}</p>
        </div>
      </div>
      <div className="grid-container-days">
        <div className="climaIcon">
          {" "}
          <p>{getDayWeek(0)}</p>
          <p>{getDate(0)}</p>
          <p>{weatherIcon}</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(1)}</p>
          <p>{getDate(1)}</p>
          <p>{weatherIcon}</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(2)}</p>
          <p>{getDate(2)}</p>
          <p>{weatherIcon}</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(3)}</p>
          <p>{getDate(3)}</p>
          <p>{weatherIcon}</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(4)}</p>
          <p>{getDate(4)}</p>
          <p>{weatherIcon}</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(5)}</p>
          <p>{getDate(5)}</p>
          <p>{weatherIcon}</p>
        </div>
        <div className="climaIcon">
          {""}
          <p>{getDayWeek(6)}</p>
          <p>{getDate(6)}</p>
          <p>{weatherIcon}</p>
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
                backgroundColor: "red",
              },
              {
                id: 2,
                label: "Min",
                data: [7, 5, 1, 2, 5, 9, 5],
                borderColor: "WHITE",
                backgroundColor: "blue",
              },
            ],
          }}
          options={options}
        />
      </div>
      <div className="confort">
        <h4>CONFORT</h4>{" "}
        <div className="elementos">
          <p>Humedad</p>
          {water}
          <p>100%</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Lluvia</p>
          {droplet}
          <p>1mm3</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Luz</p>
          {lightBulb}
          <p>46Lx</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Presion</p>
          {scale}
          <p>748 var</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Velocidad Viento</p>
          {wind}
          <p>748 var</p>
        </div>
        <div className="elementos">
          {" "}
          <p>Direccion</p>
          {compass}
          <p>748 var</p>
        </div>
      </div>
        <div>

        </div>
    </div>
  );
}

export default App;
