import "./../styles/Teams.scss";
import { useState } from "react";
import io from "socket.io-client";

import {
    ArmorHelmet,
    ArmorFull,
    SmallBomb,
    Skull,
} from "../assets/Icons";
import { getPrimaryWeapon, getSecondaryWeapon, hasBomb, hasKit, getNades } from "../utils/Equipment";
const socket = io("http://localhost:5001");


function getPlayerKills(player, side) {
    //Unused for now
    //Data to get player kills in the current round
    //is located at player.state.round_kills
}

function printArmorKitHealth(player, side) {
    if (side != "L") {
        return (
            <div>
                {" "}
                <p
                    style={{
                        color:
                            player.state.health > 50
                                ? "white"
                                : player.state.health > 20
                                ? "orange"
                                : "red",
                    }}
                >
                    {player.state.health}
                </p>
                {player.state.helmet ? <ArmorHelmet /> : player.state.armor > 0 && <ArmorFull />}
                {hasBomb(player)}
                {hasKit(player)}
            </div>
        );
    }
    return (
        <div>
            <p
                style={{
                    color:
                        player.state.health > 50
                            ? "white"
                            : player.state.health > 20
                            ? "orange"
                            : "red",
                }}
            >
                {player.state.health}
            </p>
            {hasKit(player)}
            {hasBomb(player)}
            {player.state.helmet ? <ArmorHelmet /> : player.state.armor > 0 && <ArmorFull />}
        </div>
    );
}

function printHealthBar(side, player) {
    var x = "";
    if (side == "L") {
        x = "L";
    } else {
        x = "R";
    }
    var y = "";
    if (player.team == "CT") {
        y = "CT";
    } else {
        y = "T";
    }
    if (player.state.health > 0) {
        return (
            <div className={x + "Chart"}>
                {
                    <div
                        className={
                            side === "L"
                                ? "Lbar" + y + "-" + player.state.health
                                : "Rbar" + y + "-" + player.state.health
                        }
                    />
                }
            </div>
        );
    }
    return <div className={x + "Chart"}>{<div className={x + "bar-D"} />}</div>;
}

export function Teams() {
    const [teamLeft, setTeamLeft] = useState(null);
    const [teamRight, setTeamRight] = useState(null);
    const [currentSpec, setCurrentSpec] = useState(false);

    socket.on("leftTeam", (leftTeam) => {
        setTeamLeft(leftTeam);
    });

    socket.on("rightTeam", (rightTeam) => {
        setTeamRight(rightTeam);
    });

    socket.on("player", (player) => {
        setCurrentSpec(player);
    });

    const Team = (props) => {
        if (!props.team || !props.team[0]) return <div></div>;

        let side = props.team === teamLeft ? "L" : "R";

        return (
            <div className={side == "L" ? "Lplayers" : "Rplayers"}>
                {props.team.map((player, index) => (
                    <div
                        className={
                            (player.state.health == "0" ? "dead " : "alive ") +
                            (side == "L" ? "LplayerBlock" : "RplayerBlock")
                        }
                        key={player.observer_slot}
                        id={player.steamid === currentSpec?.steamid ? "spec" : ""}
                    >
                        <div className={side == "L" ? "LArmor" : "RArmor"}>
                            {player.state.health > 0 ? (
                                <div>{printArmorKitHealth(player, side)}</div>
                            ) : (
                                <Skull className="skull" />
                            )}
                        </div>
                        <div className="playerInfo">
                            <div className={side === "L" ? "LplayerInfo" : "RplayerInfo"}>
                                <div className="healthBarText">
                                    <div>{getPrimaryWeapon(side, player)}</div>

                                    {side === "L" ? (
                                        <p className="pLeft">
                                            {player.observer_slot} | {player.name}{" "}
                                        </p>
                                    ) : (
                                        <p className="pRight">
                                            {player.name} | {player.observer_slot}{" "}
                                        </p>
                                    )}
                                </div>
                                {printHealthBar(side, player)}
                            </div>

                            <div className={side === "L" ? "subTextLeft" : "subTextRight"}>
                                <div className="secondary">{getSecondaryWeapon(side, player)}</div>
                                <div className="Nades">{getNades(side, player)}</div>
                                <div className="playerStats">
                                    <p>
                                        {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                        {player.match_stats.deaths}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
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
