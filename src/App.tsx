import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Game from "./components/Game";

function App() {
  const [count, setCount] = useState(0);

  function reload() {}

  return <Game></Game>;
}

export default App;
