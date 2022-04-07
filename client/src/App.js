import { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import io from "socket.io-client"


function App() {
  const [data, setData] = useState(null);
  const [scoreBoard, setSB] = useState(null);
  //const [inGame, setInGame] = useState(null);

  const ENDPOINT = 'http://localhost:5001/'

  useEffect(() => {

    const socket = io(ENDPOINT)

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("err", () => {
      setData(null);
    });

    socket.on("update", (update) => {
      console.log(update)
      setData(update);
      setScoreBoard(update);
      //setInGame(true);
    });

  }, []);

  function setScoreBoard(data) {
    if (data.map != undefined) {
      let scoreboard = {
        phase: data.map.phase,
        round: data.map.round,
        phase_ends_in: data.phase_countdowns.phase_ends_in,
        CTScore: data.map.team_ct.score,
        TScore: data.map.team_t.score,
      }


      if (data.phase_countdowns == null) {
        scoreboard.phase_ends_in = scoreBoard.phase_ends_in;
      }
      else scoreboard.phase_ends_in = data.phase_countdowns.phase_ends_in;

      setSB(scoreboard);
    }
    else {
      let scoreboard = {
        phase: null,
        round: null,
        phase_ends_in: 0,
        CTScore: 0,
        TScore: 0,
      }

      setSB(scoreboard);
    }
  }


  if (data == null || data.map == undefined || scoreBoard == undefined) {
    return (
      <div className="App">
        <div>
          <p>Awaiting Game</p>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="App">
        <div className="scoreboard">
          <div className="Team_one">
            <p id="CT_score">{scoreBoard.CTScore}</p>
          </div>
          <div className="Match_info">
            <p id="time">{parseInt(scoreBoard.phase_ends_in) + 1}</p>
          </div>
          <div className="Team_two">
            <p id="T_score">{scoreBoard.TScore}</p>
          </div>
        </div>
      </div>
    )
  }
};

export default App;
