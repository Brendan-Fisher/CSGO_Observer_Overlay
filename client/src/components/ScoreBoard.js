import "./../styles/ScoreBoard.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { LogoCT, LogoT, FlashingBomb, Bomb } from "../assets/Icons";

const socket = io("http://localhost:5001");


var currentBombTime = 40;

function printTime(scoreBoard) {
    if (scoreBoard.phaseInfo.phase === "bomb") {
        return <FlashingBomb className="bombImage" />
    }
    if (scoreBoard.phaseInfo.phase_ends_in < 10 && scoreBoard.phaseInfo.phase === "live") {
        return <div id="timelow">{scoreBoard.phaseInfo.phase_ends_in}</div>;
    }
    return <div id="time">{scoreBoard.phase_ends_in}</div>;
}

function BombTimer(scoreBoard) {
    if (!scoreBoard) <div></div>

    if (scoreBoard.phaseInfo.phase === "bomb") {
        return <div className="BombTimer">

            {scoreBoard.phaseInfo.phase === "defuse" ?
                <div className="Rchart">
                    <div className={"defuse-" + scoreBoard.phaseInfo.phase_ends_in}></div>
                </div>
                : <div></div>
            }

            <div className="Rchart">
                <div className={"bomb-" + currentBombTime}></div>
            </div>


        </div >
    }
}

export function ScoreBoard() {
    const [scoreBoard, setSB] = useState(null);

    useEffect(() => {
        socket.on("scoreboard", (scoreboard) => {
            setSB(scoreboard);

            if (scoreBoard && scoreBoard.phaseInfo.phase === "bomb") {
                if (scoreBoard.phaseInfo.phase_ends_in === "40.0")
                    setInterval(currentBombTime--, 1000);
                console.log(currentBombTime)

            }
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

                {BombTimer(scoreBoard)}
            </div>

        );
    } else {
        return <div></div>;
    }
}

export default ScoreBoard;
