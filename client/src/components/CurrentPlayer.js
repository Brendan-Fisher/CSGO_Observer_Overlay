import "./../styles/CurrentPlayer.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { HealthFull, ArmorNone, ArmorFull, ArmorHelmet, Defuse,SmallBomb, Bullets } from '../assets/Icons';
import {teamOneLogo, teamTwoLogo} from "../teamInfo";
import { gunMap, nadeOrder } from "../assets/Weapons";
const socket = io("http://localhost:5001");
let swap = 0
window.addEventListener("keydown", (event) => {
    if(event.key === "`") {
        if(swap === 0) {
            swap = 1
        } else {
            swap = 0
        }
    }
});

function printTeamLogo(side) {
    if (side === "CT") {
        if(swap === 0){
            return teamOneLogo;
        } else {
            return teamTwoLogo;
        }
    } else {
        if(swap === 0) {
            return teamTwoLogo;
        } else {
            return teamOneLogo;
        }
    }
}

export function Current() {
    const [player, setPlayer] = useState(null);
    const [weapon, setWeapon] = useState(null);

    useEffect(() => {
        socket.on("player", (player) => {
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
        return false;
    }

    function Grenades(player) {
        if (!player || !player.weapons) return <div/>
        let x = '';
        let gun;
        let nades = Array(4).fill("");
        let spot = 0;
        Object.keys(player.weapons).forEach(function (key) {
            gun = player.weapons[key];
            if (gun.type === "Grenade") {
                x = gun.name;
                nades[spot] = x;
                spot++;
            }
        });
        if(nades[0] === "" && !hasKitOrBomb(player)){
            return (
                <div className="Nades">
                    <p>NO UTILITY</p>
                </div>
            )
        }

        for (const nade in nades) {
            if (nades[nade] !== "") {
                nades[nade] = nadeOrder.get(nades[nade]);
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
                    {hasKitOrBomb(player)}
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
        if(weapon.type === "Knife" || weapon.type === "Grenade") {
            return <div/>
        }
        return (weapon ? <div className="ammo">
                <Bullets className="icon" />
                <div className="ammo-clip">{weapon.ammo_clip}</div> /{weapon.ammo_reserve}</div> :
          <div/>
        )
    }

    function printHealthBar(side, player) {
        let x ;
        if (side === "L") {
            x = "L";
        } else {
            x = "R";
        }
        let y;
        if (player.team === "CT") {
            y = "CT";
        } else {
            y = "T";
        }
        if (player.state.health > 0) {
            return (<div className={x + "Chart"}>
                {
                    (<div className={side === 'L' ? 'Lbar' + y + '-' + player.state.health : 'Rbar' + y + '-' + player.state.health} />)
                }
            </div>);
        }
        return (<div className={x + "Chart"}>
            {(
                <div className={x + 'bar-D'} />
            )}
        </div>);
    }

    if (player) {
        return (
            <div className="currentPlayer">
                <div className="playerBlock">
                    <div className="playerInfoTop">
                        <div className="playerVitals">
                            <div className="health"> <HealthFull className="icon" style={{fill: player.state.health > 50 ? 'white' : player.state.health > 20 ? 'orange': 'red'}}/> {player.state.health} </div>
                            <div className="armor">
                                {player.state.helmet ? <ArmorHelmet className="icon" /> : player.state.armor > 0 ? <ArmorFull className="icon" /> : <ArmorNone className="icon" />}
                                {player.state.armor}
                            </div>
                        </div>
                        <div className="player-id">
                            <div className={player.team === "CT" ? "ct-name" : "t-name"}> <p className="pLeft">{player.name}</p></div>
                            {printHealthBar("L",player)}
                        </div>

                    </div>
                    <div className="playerInfoBottom">
                        <div className="team">
                            <img className="teamImg" src={printTeamLogo(player.team)} alt=""/>
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
        return <div/>;
    }
}

export default Current;
