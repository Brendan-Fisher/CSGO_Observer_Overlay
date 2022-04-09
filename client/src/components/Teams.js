import "./../styles/Teams.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import { ArmorHelmet, ArmorFull, Defuse, SmallBomb, Skull, LogoT, LogoCT } from '../assets/Icons';
import {gunMap} from '../assets/Weapons';
const socket = io("http://localhost:5001");


function getPrimaryWeapon(side,player) {
    var playerSide;
    if(side == "L") {
        playerSide = "GunL";
    } else {
        playerSide = "GunR";
    }
    if(player.weapons == null) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    if(player.weapons.weapon_0 == null) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    if(player.state.health == 0) {
         return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    var gun;
    var x = "";
    var equipped = true;
    Object.keys(player.weapons).forEach(function(key) {
        gun = player.weapons[key];
        if(gun.type == "Rifle" || gun.type == "SniperRifle" || gun.type == "Submachine Gun" || gun.type == "Shotgun" || gun.type == "Machine Gun") {
            x = gun.name;
            if(gun.state != "active") {
                equipped = false;
            }
        }

    });
    if(x == "") {
        Object.keys(player.weapons).forEach(function(key) {
            gun = player.weapons[key];
            if(gun.type == "Pistol") {
                x = gun.name;
                if(gun.state != "active") {
                    equipped = false;
                }
            }
        });
    }
    if(x == "") {
        if(player.weapons.weapon_0.state != "active") {
            playerSide=playerSide + "u";
        }
        return(<img className={playerSide} src={gunMap.get(player.weapons.weapon_0.name)}></img>);
    }
    if(!equipped) {
        playerSide=playerSide + "u";
    }
    return(<img className={playerSide} src={gunMap.get(x)}></img>);
}
function getSecondaryWeapon(side,player) {
    var playerSide;
    if(side == "L") {
        playerSide = "GunL2";
    } else {
        playerSide = "GunR2";
    }
    var x = "";
    if(player.weapons == null) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    if(player.weapons.weapon_0 == null) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    if(!hasPrimary(player)) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    var gun;
    var equipped = false;
    Object.keys(player.weapons).forEach(function(key) {
        gun = player.weapons[key];
        if(gun.type == "Pistol") {
            x = gun.name;
            if(gun.state == "active") {
                playerSide = playerSide + "e";
            }
        }
    });
    if(gunMap.get(x) != null) {
        return(<img className={playerSide} src={gunMap.get(x)}></img>);
    }
    return (<img className={playerSide} src={gunMap.get("")}></img>);

}
function hasPrimary(player) {
    var x = false;
    var gun;
    Object.keys(player.weapons).forEach(function(key) {
        gun = player.weapons[key];
        if(gun.type == "Rifle" || gun.type == "SniperRifle" || gun.type == "Submachine Gun" || gun.type == "Shotgun" || gun.type == "Machine Gun") {
            x = true;
        }

    });
    return x;
}

export function Teams() {
    const [teamLeft, setTeamLeft] = useState(null);
    const [teamRight, setTeamRight] = useState(null);
    const [currentSpec, setCurrentSpec] = useState(false);

    socket.on("leftTeam", (leftTeam) => {
        //console.log("Setting CT team");
        setTeamLeft(leftTeam);
    });

    socket.on("rightTeam", (rightTeam) => {
        //console.log("Setting T team");
        //console.log(rightTeam)
        setTeamRight(rightTeam);
    });

    socket.on("player", (player) => {
        //console.log(`Spectating ${player.name}`);
        setCurrentSpec(player);
        //console.log(player);
    });


    const Team = (props) => {
        if (!props.team || !props.team[0]) return <div></div>

        let side = props.team === teamLeft ? "L" : "R";
        let switched = props.team[0].team === "CT" ? "C" : ""
        // console.log(side);
        // console.log(props.team);
        // console.log(props.switched);

        return (
            <div>
                <div className={side == "L" ? "CTplayers" : "Tplayers"} >
                    {props.team.map((player, index) => (
                        <div className={side == "L" ? "CTplayerBlock" : "TplayerBlock"} key={player.observer_slot}>
                            <div
                                className={side == "L" ? "CTArmor" : "TArmor"}
                                id={player.steamid === currentSpec.steamid ? "spec" : ""}
                            >
                                {player.state.health > 0 ? (
                                    <div>
                                        <p
                                            style={{
                                                color: player.state.health > 50 ? "white" : player.state.health > 20 ? "orange" : "red",
                                            }}
                                        >
                                            {player.state.health}
                                        </p>

                                        {player.state.helmet ? (
                                            <ArmorHelmet />
                                        ) : (
                                            player.state.armor > 0 && <ArmorFull />
                                        )}
                                    </div>
                                ) : (
                                    <Skull className="skull" />
                                )}
                            </div>
                            <div className={side == "L" ? "CTplayerInfo" : "TplayerInfo"}>
                                <div className="healthBarText">
                                    <div>{getPrimaryWeapon(side,player)}</div>
                                    <div>{getSecondaryWeapon(side,player)}</div>
                                    <p className={side == "L" ? "pLeft" : "pRight"}>
                                        {" "}
                                        {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                        {player.match_stats.deaths} ADR: {player.match_stats.adr}
                                    </p>

                                </div>
                                <div className={side == "L" ? "CTchart" : "Tchart"}>
                                    {player.state.health > 0 ? (
                                        <div
                                            className={
                                                switched +
                                                "Tbar-" +
                                                player.state.health
                                            }
                                        ></div>
                                    ) : (
                                        <div className={side == "L" ? "CTbar-D" : "Tbar-D"}></div>
                                    )}
                                </div>
                            </div>

                            <div className={side == "L" ? "subTextLeft" : "subTextRight"}>
                                {player.observer_slot}. {player.name}{" "}
                            </div>
                        </div>
                    ))}
                </div>
            </div>)
    }
    if (teamLeft && teamRight) {
        return (

            <div>
                <Team team={teamLeft}></Team>
                <Team team={teamRight}></Team>
            </div>
        );
    } else return <div></div>;
}

export default Teams;
