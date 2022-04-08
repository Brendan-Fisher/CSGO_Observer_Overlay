import "./../styles/ScoreBoard.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { LogoCT, LogoT } from "../assets/Icons";

const socket = io("http://localhost:5001");

export function ScoreBoard() {
    const [scoreBoard, setSB] = useState(null);

    useEffect(() => {
        socket.on("scoreboard", (scoreboard) => {
            console.log("Received scoreboard");
            setSB(scoreboard);
        });
    });

    if (scoreBoard) {
        return (
            <div className="scoreboard">
                <div className="Team_one">
                    <img className="TeamLogo" src={!(scoreBoard.round >= 15) ? LogoCT : LogoT}></img>
                    <p id="CT_score">{!(scoreBoard.round >= 15) ? scoreBoard.CTScore : scoreBoard.TScore}</p>
                </div>
                <div className="Match_info">
                    <p id="time">{scoreBoard.phase_ends_in}</p>
                    <p id="time">ROUND {scoreBoard.round + 1}/30</p>
                </div>
                <div className="Team_two">
                    <img className="TeamLogo" src={!(scoreBoard.round >= 15) ? LogoT : LogoCT}></img>
                    <p id="T_score">{!(scoreBoard.round >= 15) ? scoreBoard.TScore : scoreBoard.CTScore}</p>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default ScoreBoard;
