import "./../styles/ScoreBoard.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { LogoCT, LogoT, Bomb } from "../assets/Icons";

const socket = io("http://localhost:5001");
function printTime(scoreBoard) {
    if (scoreBoard.phaseInfo.phase == "bomb") {
        return <img className="bombImage" src={Bomb}></img>;
    }
    if (scoreBoard.phaseInfo.phase_ends_in < 10 && scoreBoard.phaseInfo.phase == "live") {
        return <div id="timelow">{scoreBoard.phaseInfo.phase_ends_in}</div>;
    }
    return <div id="time">{scoreBoard.phase_ends_in}</div>;
}
export function ScoreBoard() {
    const [scoreBoard, setSB] = useState(null);

    useEffect(() => {
        socket.on("scoreboard", (scoreboard) => {
            setSB(scoreboard);
            //console.log(scoreboard)
        });
    });
    if (scoreBoard) {
        return (
            <div className="scoreboard">
                <div
                    className="TeamName"
                    {...(scoreBoard.phaseInfo.phase !== "freezetime"
                        ? { style: { display: "none" } }
                        : {})}
                >
                    <p className="teamLeftName">
                        {scoreBoard.round <= 15 ? scoreBoard.CTName : scoreBoard.TName}
                    </p>
                </div>
                <div className="teamImage">
                    <img src={scoreBoard.leftCT ? LogoCT : LogoT}></img>
                </div>
                <div className="TeamLeft">
                    <p className={scoreBoard.leftCT ? "ct-score" : "tscore"}>
                        {scoreBoard.leftCT ? scoreBoard.CTScore : scoreBoard.TScore}
                    </p>
                </div>
                <div className="Match_info">
                    {printTime(scoreBoard)}
                    <div id="round">ROUND {scoreBoard.round + 1}/30</div>
                </div>
                <div className="TeamRight">
                    <p className={scoreBoard.leftCT ? "tscore" : "ct-score"}>
                        {scoreBoard.leftCT ? scoreBoard.TScore : scoreBoard.CTScore}
                    </p>
                </div>
                <div className="teamImage">
                    <img src={scoreBoard.leftCT ? LogoT : LogoCT}></img>
                </div>
                <div
                    className="TeamName"
                    {...(scoreBoard.phaseInfo.phase !== "freezetime"
                        ? { style: { display: "none" } }
                        : {})}>
                    <p className="teamRightName">
                        {scoreBoard.round <= 15 ? scoreBoard.TName : scoreBoard.CTName}
                    </p>
                </div>
            </div >
        );
    } else {
        return <div></div>;
    }
}

export default ScoreBoard;
