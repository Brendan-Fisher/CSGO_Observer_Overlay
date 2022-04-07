import { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import io from "socket.io-client"

function App() {
  const [data, setData] = useState(null);
  const [scoreBoard, setSB] = useState(null);
  const [players, setPlayers] = useState(null);
  const [teamCT, setTeamCT] = useState(null);
  const [teamT, setTeamT] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
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
      //console.log(update)
      setData(update);
      setScoreBoard(update);
      setPlayersData(update)
      //setInGame(true);
    });

  }, []);

  function setPlayersData(data) {
    if (data.map === undefined) return;
    console.log(data);


    let playersList = Object.entries(data.allplayers).map(([key, value]) => (
      {
        steamid: key,
        name: value.name,
        team: value.team,
        observer_slot: value.observer_slot,
        state: value.state,
        match_stats: value.match_stats,
        weapons: value.weapons,
        position: value.position,
        forward: value.forward
      }))


    if (playersList.filter(p => p.steamid === data.player.steamid).length > 0) {
      setCurrentPlayer(data.player);
    } else setCurrentPlayer(null);

    setPlayers(playersList);
    setTeamCT(playersList.filter(p => p.team === "CT"));
    setTeamT(playersList.filter(p => p.team === "T"));
    //console.log(playersList);
    //console.log(players);
  }

  function setScoreBoard(data) {
    if (data.map != undefined) {
      let scoreboard = {
        phase: data.map.phase,
        round: data.map.round,
        phase_ends_in: data.phase_countdowns.phase_ends_in < 0 ? 0 : data.phase_countdowns.phase_ends_in,
        CTScore: data.map.team_ct.score,
        TScore: data.map.team_t.score,
        CTName: "CT",
        TName: "T"
      }

      let time = parseInt(scoreboard.phase_ends_in - 0.2) + 1; // 0.2 for delay generated from communication
      scoreboard.phase_ends_in = (parseInt(time / 60)) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60);

      // if (data.phase_countdowns == null) {
      //   scoreboard.phase_ends_in = scoreBoard.phase_ends_in;
      // }
      // else scoreboard.phase_ends_in = data.phase_countdowns.phase_ends_in;

      setSB(scoreboard);
      //console.log(scoreBoard);
    }
    else {
      let scoreboard = {
        phase: null,
        round: null,
        phase_ends_in: 0,
        CTScore: 0,
        TScore: 0,
        CTName: "CT",
        TName: "T"
      }

      setSB(scoreboard);
    }
  }

  function CurrentPlayer() {
    let player = currentPlayer;
    console.log(player)

    if (!player) return <div>BALLS</div>;
    return <div>
      <div> {player.name} {player.state.health} {player.state.armor} {player.state.helmet ? "HELMET" : "NO HELMET"} </div>
      <div>K   A   D   ADR</div>      KILLS
      <div> {player.match_stats.kills}   {player.match_stats.assists}   {player.match_stats.deaths} {player.state.round_totaldmg}  {player.state.round_kills}</div>

    </div>
  };

  function TeamCT() {
    //console.log(players);
    if (!teamCT) return <div>NUTS</div>
    return teamCT.map((player, index) => (
      <tr key={player.observer_slot} style={{ backgroundColor: "rgba(0, 19, 127, 0.35)" }}>
        <div> {player.match_stats.kills} / {player.match_stats.assists} / {player.match_stats.deaths}</div>

        <div>{player.observer_slot}. {player.name} {player.state.health} {player.state.armor} {player.state.helmet ? "HELMET" : "NO HELMET"} </div>

      </tr>
    ));
  };

  function TeamT() {
    //console.log(players);
    if (!teamT) return <div>NUTS</div>
    return teamT.map((player, index) => (
      <tr key={player.observer_slot} style={{ backgroundColor: "rgba(0, 19, 127, 0.35)" }} >
        <div> {player.match_stats.kills} / {player.match_stats.assists} / {player.match_stats.deaths}</div>

        <div>{player.observer_slot}. {player.name} {player.state.health} {player.state.armor} {player.state.helmet ? "HELMET" : "NO HELMET"} </div>

      </tr>
    ));
  };

  if (data == null || data.map == undefined || scoreBoard == undefined) {
    return (
      <div className="scoreboard">
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
            <p id="CT_score">{scoreBoard.CTName} {scoreBoard.CTScore}</p>
          </div>
          <div className="Match_info">
            <p id="time">{scoreBoard.phase_ends_in}</p>
            <p id="time">ROUND  {scoreBoard.round + 1}/30</p>
          </div>
          <div className="Team_two">
            <p id="T_score">{scoreBoard.TScore} {scoreBoard.TName}</p>

          </div>

        </div>
        <div className='currentPlayer'> <CurrentPlayer></CurrentPlayer> </div>

        <div className='CTplayers'> <TeamCT /></div>

        <div className='Tplayers'> <TeamT /></div>





      </div>
    )
  }
};

export default App;
