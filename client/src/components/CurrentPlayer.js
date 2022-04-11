import "./../styles/CurrentPlayer.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { HealthFull, ArmorNone, ArmorFull, ArmorHelmet, Defuse, Skull, LogoCT, LogoT } from '../assets/Icons';
const socket = io("http://localhost:5001");

export function Current() {
    const [player, setPlayer] = useState(null);
    const [weapon, setWeapon] = useState(null);

    useEffect(() => {
        //console.log("Current Player");
        socket.on("player", (player) => {
            //console.log(player);
            //console.log(`Spectating ${player.name}`);

            console.log([...Object.values(player.weapons)].find(w => w.state === "active"))
            setWeapon([...Object.values(player.weapons)].find(w => w.state === "active"));
            setPlayer(player);
        });
    });

    if (player) {
        return (
            <div className="currentPlayer">
                <div className="playerBlock">
                    <div className="playerInfoTop">
                        <div className="playerVitals">

                            <div className="health"> <HealthFull className="icon"></HealthFull> {player.state.health} </div>

                            <div className="armor">
                                {player.state.helmet ? <ArmorHelmet className="icon" /> : player.state.armor > 0 ? <ArmorFull className="icon" /> : <ArmorNone className="icon" />}
                                {player.state.armor}
                            </div>
                        </div>
                        <div className="player-id">
                            <div className={player.team === "CT" ? "ct-name" : "t-name"}> {player.name} </div>
                        </div>

                    </div>
                    <div className="playerInfoBottom">
                        <div className="team">
                            <img className="teamImg" src={player.team === "CT" ? LogoCT : LogoT}></img>
                        </div>
                        <div className="playerInfo">
                            <div className="player-score">

                                <div>
                                    <div className="label">ADR</div>
                                    <div className="value">{player.match_stats.adr}{" "}</div>
                                </div>

                                <div>
                                    <div className="label">K</div>
                                    <div className="value">{player.match_stats.kills}{" "}</div>
                                </div>

                                <div>
                                    <div className="label">A</div>
                                    <div className="value">{player.match_stats.assists}{" "}</div>
                                </div>

                                <div>
                                    <div className="label">D</div>
                                    <div className="value">{player.match_stats.deaths}{" "}</div>
                                </div>

                            </div>
                            <div className="player-equipment">
                                {weapon ? <div className="ammo"> {weapon.ammo_clip}/{weapon.ammo_reserve}</div> :
                                    <div></div>
                                }

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default Current;
