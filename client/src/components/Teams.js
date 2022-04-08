import "./../styles/Teams.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import { ArmorHelmet, ArmorFull, Defuse, SmallBomb, Skull } from "../assets/Icons";

const socket = io("http://localhost:5001");

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
});

if (teamLeft && teamRight) {
    return (
        <div>
            <div className="CTplayers">
                {teamLeft.map((player, index) => (
                    <div className="CTplayerBlock" key={player.observer_slot}>
                        <div
                            className="CTArmor"
                            id={player.steamid === currentSpec.steamid ? "spec" : ""}
                        >
                            {player.state.health > 0 ? (
                                <div>
                                    <p
                                        style={{
                                            color: player.state.health <= 20 ? "red" : "white",
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
                        <div className="CTplayerInfo">
                            <div className="healthBarText">
                                <p>
                                    {" "}
                                    {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                    {player.match_stats.deaths} ADR: {player.match_stats.adr}
                                </p>
                            </div>
                            <div className="CTchart">
                                {player.state.health > 0 ? (
                                    <div
                                        className={
                                            (teamLeft[0].team === "CT" ? "C" : "") +
                                            "Tbar-" +
                                            player.state.health
                                        }
                                    ></div>
                                ) : (
                                    <div className="CTbar-D"></div>
                                )}
                            </div>
                        </div>

                        <div className="subText">
                            {player.observer_slot}. {player.name} {player.state.health}{" "}
                        </div>
                    </div>
                ))}
            </div>

            <div className="Tplayers">
                {teamRight.map((player, index) => (
                    <div className="TplayerBlock" key={player.observer_slot}>
                        <div
                            className="TArmor"
                            id={player.steamid === currentSpec.steamid ? "spec" : ""}
                        >
                            {player.state.health > 0 ? (
                                <div>
                                    <p
                                        style={{
                                            color: player.state.health <= 20 ? "red" : "white",
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
                        <div className="TplayerInfo">
                            <div className="healthBarText">
                                <p>
                                    {" "}
                                    {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                    {player.match_stats.deaths} ADR: {player.match_stats.adr}
                                </p>
                            </div>
                            <div className="Tchart">
                                {player.state.health > 0 ? (
                                    <div
                                        className={
                                            (teamRight[0].team === "CT" ? "C" : "") +
                                            "Tbar-" +
                                            player.state.health
                                        }
                                    ></div>
                                ) : (
                                    <div className="Tbar-D"></div>
                                )}
                            </div>
                        </div>

                        <div className="subText">
                            {player.observer_slot}. {player.name} {player.state.health}{" "}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} else return <div></div>;
}

export default Teams;
