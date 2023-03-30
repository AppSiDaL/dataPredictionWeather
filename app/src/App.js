import "./App.css";

function App() {
  var today = new Date();
 
  var time = today.toLocaleTimeString();
  var date= today.toLocaleDateString();
  var now= today.toLocaleString();

  var temporal = new Date();

  temporal.setHours(6,0,0);
  var amanecerTime= temporal.toLocaleTimeString();

  temporal.setHours(12,0,0);
  var diaTime= temporal.toLocaleTimeString();

  temporal.setHours(18,0,0);
  var atardecerTime= temporal.toLocaleTimeString();

  temporal.setHours(21,0,0);
  var anochecerTime= temporal.toLocaleTimeString();


  console.log(time);
  console.log(anochecerTime);
  console.log(date);
  var hora;
  var tiempo;

  if (time > amanecerTime) {
    hora="app-sunrise";
    tiempo="Amanecer";
  }
  if (time >diaTime) {
    hora="app-day";
    tiempo="Dia";
  }
  if (time >atardecerTime) {
    hora="app-sunset";
    tiempo="Atardecer";
  }
  if(time>anochecerTime){
    hora="app-night"
    tiempo="Noche";
  }

  return (
    <div className={hora}>
      <h3 className="city">TESJo</h3>
      <p>{now}</p>
      <p className="temperatura">25/7º</p>
      <p className="clima">{tiempo}</p>
    </div>
  );
}

export default App;
