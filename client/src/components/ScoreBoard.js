import io from "socket.io-client";
import { useEffect, useState } from "react";

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
                    <p id="CT_score">
                        {scoreBoard.CTName} {scoreBoard.CTScore}
                    </p>
                </div>
                <div className="Match_info">
                    <p id="time">{scoreBoard.phase_ends_in}</p>
                    <p id="time">ROUND {scoreBoard.round + 1}/30</p>
                </div>
                <div className="Team_two">
                    <p id="T_score">
                        {scoreBoard.TScore} {scoreBoard.TName}
                    </p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="scoreboard">
                <div>
                    <p>Awaiting Game</p>
                </div>
            </div>
        );
    }
}

export default ScoreBoard;
