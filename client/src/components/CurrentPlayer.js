import "./../styles/CurrentPlayer.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { HealthFull, ArmorNone, ArmorFull, ArmorHelmet, Defuse, Skull, LogoCT, LogoT, SmallBomb, Bullets } from '../assets/Icons';
import { gunMap, NadeOrder } from "../assets/Weapons";
const socket = io("http://localhost:5001");

export function Current() {
    const [player, setPlayer] = useState(null);
    const [weapon, setWeapon] = useState(null);

    useEffect(() => {
        //console.log("Current Player");
        socket.on("player", (player) => {
            //console.log(player);
            //console.log(`Spectating ${player.name}`);

            //console.log([...Object.values(player.weapons)].find(w => w.state === "active"))
            if (player) setWeapon([...Object.values(player.weapons)].find(w => w.state === "active"));
            setPlayer(player);
        });

    });

    function hasKitOrBomb(player) {
        if (player.state.defusekit === true) {
            return <Defuse />;
        } else {
            let bomb = [...Object.values(player.weapons)].find(w => w.name === "weapon_c4");
            if (bomb) return <SmallBomb />
        }
    }

    function Grenades(player) {
        if (!player || !player.weapons) return <div></div>
        var x = "";
        var gun;
        var nades = Array(4).fill("");
        var spot = 0;
        Object.keys(player.weapons).forEach(function (key) {
            gun = player.weapons[key];
            if (gun.type === "Grenade") {
                x = gun.name;
                nades[spot] = x;
                spot++;
            }
        });
        if(nades[0] === ""){
            return (
                <div className="Nades">
                    <p>NO UTILITY</p>
                </div>
            )
        }

        for (const nade in nades) {
            if (nades[nade] !== "") {
                nades[nade] = NadeOrder.get(nades[nade]);
            }
        }
        nades.sort();
        nades.reverse();

        return (
            <div className="Nades">
                    <img alt="Nade" className={`Nade ${nades[3]}`} src={gunMap.get(nades[3])} />
                    <img alt="Nade" className={`Nade ${nades[2]}`} src={gunMap.get(nades[2])} />
                    <img alt="Nade" className={`Nade ${nades[1]}`} src={gunMap.get(nades[1])} />
                    <img alt="Nade" className={`Nade ${nades[0]}`} src={gunMap.get(nades[0])} />
            </div>
        )
    }
    function getAmmo(player) {
        if(!player) {
            return;
        }
        if(weapon == null) {
            return
        }
        if(weapon.type == "Knife" || weapon.type == "Grenade") {
            return <div></div>
        }
        return (weapon ? <div className="ammo">
                <Bullets className="icon" />
                <div className="ammo-clip">{weapon.ammo_clip}</div> /{weapon.ammo_reserve}</div> :
          <div></div>
        )
    }
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
                            <div className="kit-bomb">{hasKitOrBomb(player)}</div>
                        </div>

                    </div>
                    <div className="playerInfoBottom">
                        <div className="team">
                            <img className="teamImg" src={player.team === "CT" ? LogoCT : LogoT}></img>
                        </div>
                        <div className="playerInfo">
                            <div className="player-score">

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
                                {Grenades(player)}
                                {getAmmo(player)}

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
