import "./../styles/CurrentPlayer.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";


const socket = io("http://localhost:5001");


export function Current() {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        console.log("Current Player");
        socket.on("player", (player) => {
            console.log(`Spectating ${player.name}`);
            setPlayer(player);
        });
    });


    if (player) {
        return (
            <div className="currentPlayer">
                <div>
                    {" "}
                    {player.name} {player.state.health} {player.state.armor}{" "}
                    {player.state.armor} {player.state.helmet ? "HELMET" : player.state.armor > 0 ? "NO HELMET" : "NO ARMOR"}{" "}
                </div>
                <div>K A D ADR KILLS </div>
                <div>
                    {" "}
                    {player.match_stats.kills} {player.match_stats.assists}{" "}
                    {player.match_stats.deaths} {player.state.round_totaldmg}{" "}
                    {player.state.round_kills}
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default Current;
