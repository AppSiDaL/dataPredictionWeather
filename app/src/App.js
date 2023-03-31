import "./App.css";

function App() {
  var today = new Date();

  var time = today.getHours();
  var now = today.toLocaleString();

  var temporal = new Date();

  temporal.setHours(6, 0, 0);
  var amanecerTime = temporal.getHours();

  temporal.setHours(10, 0, 0);
  var diaTime = temporal.getHours();

  temporal.setHours(18, 0, 0);
  var atardecerTime = temporal.getHours();

  temporal.setHours(21, 0, 0);
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

    if (hour>=13) {
      hour=hour-12;
      system="am";
    }
    return hour + ":00 " + system;;
  }

  temporal = new Date();
  var horas = temporal.getHours();
  return (
    <div className={hora}>
      <h3 className="city">TESJo</h3>
      <p>{now}</p>
      <p className="temperatura">25/7º</p>
      <p className="clima">{tiempo}</p>
      <div className="grid-container">
        <div>{fixHour(horas + 1)}</div>
        <div>{fixHour(horas + 2)}</div>
        <div>{fixHour(horas + 3)}</div>
        <div>{fixHour(horas + 4)}</div>
        <div>{fixHour(horas + 5)}</div>
        <div>{fixHour(horas + 6)}</div>
        <div>{fixHour(horas + 7)}</div>
        <div>{fixHour(horas + 8)}</div>
        <div>{fixHour(horas + 9)}</div>
        <div>{fixHour(horas + 10)}</div>
        <div>{fixHour(horas + 11)}</div>
        <div>{fixHour(horas + 12)}</div>
        <div>{fixHour(horas + 13)}</div>
        <div>{fixHour(horas + 14)}</div>
        <div>{fixHour(horas + 15)}</div>
        <div>{fixHour(horas + 16)}</div>
        <div>{fixHour(horas + 17)}</div>
        <div>{fixHour(horas + 18)}</div>
        <div>{fixHour(horas + 19)}</div>
        <div>{fixHour(horas + 20)}</div>
        <div>{fixHour(horas + 21)}</div>
        <div>{fixHour(horas + 22)}</div>
        <div>{fixHour(horas + 23)}</div>
        <div>{fixHour(horas + 24)}</div>
      </div>
    </div>
  );
}

export default App;
