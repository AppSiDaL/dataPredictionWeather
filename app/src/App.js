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

  var horas= temporal.getHours();
  return (
    <div className={hora}>
      <h3 className="city">TESJo</h3>
      <p>{now}</p>
      <p className="temperatura">25/7º</p>
      <p className="clima">{tiempo}</p>
      <div className="grid-container">
        <div class="grid-item">{horas+1}</div>
        <div class="grid-item">{}</div>
        <div class="grid-item">3</div>
        <div class="grid-item">4</div>
        <div class="grid-item">5</div>
        <div class="grid-item">6</div>
        <div class="grid-item">7</div>
        <div class="grid-item">8</div>
        <div class="grid-item">9</div>
        <div class="grid-item">10</div>
        <div class="grid-item">11</div>
        <div class="grid-item">12</div>
        <div class="grid-item">13</div>
        <div class="grid-item">14</div>
        <div class="grid-item">15</div>
        <div class="grid-item">16</div>
        <div class="grid-item">17</div>
        <div class="grid-item">18</div>
        <div class="grid-item">19</div>
        <div class="grid-item">20</div>
        <div class="grid-item">21</div>
        <div class="grid-item">22</div>
        <div class="grid-item">23</div>
        <div class="grid-item">24</div>
      </div>
      
    </div>
  );
}

export default App;
