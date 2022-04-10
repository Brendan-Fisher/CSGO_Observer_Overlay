import "./../styles/CurrentPlayer.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { HealthFull, ArmorNone, ArmorFull, ArmorHelmet, Defuse, Skull, LogoCT, LogoT } from '../assets/Icons';
const socket = io("http://localhost:5001");

export function Current() {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        //console.log("Current Player");
        socket.on("player", (player) => {
            //console.log(player);
            //console.log(`Spectating ${player.name}`);
            setPlayer(player);
        });
    });

    if (player) {
        return (
            <div className="currentPlayer">
                <div className="playerBlock">
                    <div className="playerInfoTop">
                        <div className="playerVitals">
                            <HealthFull></HealthFull>
                            {player.state.health}
                            {player.state.helmet ? <ArmorHelmet /> : player.state.armor > 0 ? <ArmorFull /> : <ArmorNone />}
                            {player.state.armor}

                        </div>
                        <div className={player.team === "CT" ? "ct-name" : "t-name"}> {player.name} </div>
                    </div>
                    <div className="playerInfoBottom">
                        <div className="team">
                            <img className="teamImg" src={player.team === "CT" ? LogoCT : LogoT}></img>
                        </div>
                        <div className="playerInfo">
                            <span style={{ color: '#FF0000' }}>ADR</span>{player.match_stats.adr}{" | "}
                            <span style={{ color: '#FF0000' }}>K</span>{player.match_stats.kills}{" "}
                            <span style={{ color: '#FF0000' }}>A</span>{player.match_stats.assists}{" "}
                            <span style={{ color: '#FF0000' }}>D</span>{player.match_stats.deaths}</div>
                    </div>

                </div>
            </div>

        );
    } else {
        return <div></div>;
    }
}

export default Current;
