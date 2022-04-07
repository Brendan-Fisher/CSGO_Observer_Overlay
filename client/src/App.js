import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

import Teams from "./components/Teams";
import ScoreBoard from "./components/ScoreBoard";
import Current from "./components/CurrentPlayer";

const ENDPOINT = "http://localhost:5001/";

export const socket = io(ENDPOINT);

function App() {
  const [isSpec, setIsSpec] = useState(null);
  //const [inGame, setInGame] = useState(null);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("spec", (bool) => {
      bool ? setIsSpec(true) : setIsSpec(false);
    });

  }, []);

  if (!isSpec) {
    return (
      <div className="no-game">
        <div>
          <p>Awaiting Game</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Current />
      <ScoreBoard />
      <Teams />
    </div>
  );
}

export default App;
