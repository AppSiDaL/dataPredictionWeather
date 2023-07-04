import "./Stats.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const fechaActual = new Date();
  const updateBridge=()=>{
      axios
        .get("https://tesjo-clima-api.onrender.com/api/bridge")
        .then(function (response) {
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error);
        });
  }
  return (
    <>
      <div className="top">
        <h2 className="topTitle">
          Tecnologico de Estudios Superiores, Jocotitlan, Edo. Mexico. a{" "}
          {fechaActual.toDateString()}
        </h2>
      </div>
      <div className="navbar">
        <Link className="timeRange" to="/">
          Landing
        </Link>
        <Link className="timeRange" to="/now" onClick={updateBridge}>
          Ahora
        </Link>
        <Link className="timeRange" to="/horas">
          Horas
        </Link>
        <Link className="timeRange" to="/week">
          Semana
        </Link>
        <Link className="timeRange" to="/month">
          Mes
        </Link>
      </div>
    </>
  );
}
