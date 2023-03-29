import "./App.css";

function App() {
  // crea un nuevo objeto `Date`
  var today = new Date();

  // obtener la fecha y la hora
  var now = today.toLocaleString();
  console.log(now);
  return (
    <div className="app">
      <h1>Clima</h1>
    </div>
  );
}

export default App;
