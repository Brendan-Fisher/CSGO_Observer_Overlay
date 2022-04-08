import "./../styles/Teams.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5001");

export function Teams() {
    const [teamLeft, setTeamLeft] = useState(null);
    const [teamRight, setTeamRight] = useState(null);
    const [switched, setSwitched] = useState(false);

    useEffect(() => {
        socket.on("switchedSides", (switchedSides) => {
            console.log("Switched sides");
            setSwitched(switchedSides);
        });

        socket.on("leftTeam", (leftTeam) => {
            //console.log("Setting CT team");

            setTeamLeft(leftTeam);
        });

        socket.on("rightTeam", (rightTeam) => {
            //console.log("Setting T team");
            setTeamRight(rightTeam);
        });
    });

    if (teamLeft && teamRight) {
        return (
            <div>
                <div className="Tplayers">
                    {teamRight.map((player, index) => (
                        <div className="TplayerBlock" key={player.observer_slot}>
                            <div className="Tchart">
                                {player.state.health > 0 ? (
                                    <div className={(!switched ? "" : "C") + "Tbar-" + player.state.health}></div>
                                ) : (
                                    <div className="Tbar-D"></div>
                                )}
                            </div>
                            <div>
                                {" "}
                                {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                {player.match_stats.deaths} ADR: {player.match_stats.adr}
                            </div>

                            <div>
                                {player.observer_slot}. {player.name} {player.state.health}{" "}
                                {player.state.armor}{" "}
                                {player.state.helmet
                                    ? "HELMET"
                                    : player.state.armor > 0
                                        ? "NO HELMET"
                                        : "NO ARMOR"}{" "}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="CTplayers">
                    {teamLeft.map((player, index) => (
                        <div className="CTplayerBlock" key={player.observer_slot}>
                            <div className={!switched ? "CTchart" : "Tchart"}>
                                {player.state.health > 0 ? (
                                    <div className={(!switched ? "C" : "") + "Tbar-" + player.state.health}></div>
                                ) : (
                                    <div className="CTbar-D"></div>
                                )}
                            </div>
                            <div>
                                {" "}
                                {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                {player.match_stats.deaths} ADR: {player.match_stats.adr}
                            </div>

                            <div>
                                {player.observer_slot}. {player.name} {player.state.health}{" "}
                                {player.state.armor}{" "}
                                {player.state.helmet
                                    ? "HELMET"
                                    : player.state.armor > 0
                                        ? "NO HELMET"
                                        : "NO ARMOR"}{" "}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else return <div></div>;
}

export default Teams;
