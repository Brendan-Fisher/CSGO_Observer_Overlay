import io from "socket.io-client";
import { useEffect, useState } from "react";

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
                    {player.state.helmet ? "HELMET" : "NO HELMET"}{" "}
                </div>
                <div>K A D ADR</div> KILLS
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
