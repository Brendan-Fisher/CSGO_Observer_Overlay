import "./../styles/CurrentPlayer.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

export function Current() {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        //console.log("Current Player");
        socket.on("player", (player) => {
            //console.log(`Spectating ${player.name}`);
            setPlayer(player);
        });
    });

    if (player) {
        return (
            <div className="playerBlock">
                <div className="playerName">
                    {player.name}{" "}
                    <span style={{ color: '#FF0000' }}>HEALTH</span>{player.state.health}{" "}
                    <span style={{ color: '#FF0000' }}>ARMOR</span>{player.state.armor}{" "}
                    {player.state.helmet ? "HELMET" : player.state.armor > 0 ? "NO HELMET" : "NO ARMOR"}{" "}
                </div>
                <div className="playerInfo">
                    <span style={{ color: '#FF0000' }}>ADR</span>{player.match_stats.adr}{" | "}
                    <span style={{ color: '#FF0000' }}>K</span>{player.match_stats.kills}{" "}
                    <span style={{ color: '#FF0000' }}>A</span>{player.match_stats.assists}{" "}
                    <span style={{ color: '#FF0000' }}>D</span>{player.match_stats.deaths}</div>
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default Current;
