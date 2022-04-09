import "./../styles/ScoreBoard.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { LogoCT, LogoT,Bomb } from "../assets/Icons";

const socket = io("http://localhost:5001");
function printTime(scoreBoard) {
  console.log(scoreBoard.phaseInfo)
  if(scoreBoard.phaseInfo.phase == "bomb" ) {
    return <img className="bombImage" src={Bomb}></img>
  }
  return <div id="time">{scoreBoard.phase_ends_in}</div>
}
export function ScoreBoard() {
    const [scoreBoard, setSB] = useState(null);

    useEffect(() => {
        socket.on("scoreboard", (scoreboard) => {
            setSB(scoreboard);
        });
    });
    if (scoreBoard) {
        return (
            <div className="scoreboard">
                <div className="TeamLogo">
                    <img className="teamImage" src={scoreBoard.round < 15 ? LogoCT : LogoT}></img>
                </div>
                <div className="TeamLeft">
                    <p id="CT_score">{scoreBoard.round < 15 ? scoreBoard.CTScore : scoreBoard.TScore}</p>
                </div>
                <div className="Match_info">
                  {printTime(scoreBoard)}
                    <div id="round">ROUND {scoreBoard.round + 1}/30</div>
                </div>
                <div className="TeamRight">
                    <p id="T_score">{scoreBoard.round < 15 ? scoreBoard.TScore : scoreBoard.CTScore}</p>
                </div>
                <div className="TeamLogo">
                    <img className="teamImage" src={scoreBoard.round < 15 ? LogoT : LogoCT}></img>
                </div>

            </div>
        );
    } else {
        return <div></div>;
    }
}

export default ScoreBoard;
