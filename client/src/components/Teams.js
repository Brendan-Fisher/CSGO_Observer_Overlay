import "./../styles/Teams.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5001");

export function Teams() {
    const [teamCT, setTeamCT] = useState(null);
    const [teamT, setTeamT] = useState(null);

    useEffect(() => {
        socket.on("CTTeam", (CTTeam) => {
            //console.log("Setting CT team");
            setTeamCT(CTTeam);
        });

        socket.on("TTeam", (TTeam) => {
            //console.log("Setting T team");
            setTeamT(TTeam);
        });
    });
    let teamSlotLeft = 0;
    let teamSlotRight = 0;
    if (teamCT && teamT) {
        return (
            <div>
                <div className="Tplayers">
                    {teamT.map((player, index) => (
                        <div className="TplayerBlock" key={player.observer_slot}>
                            <div className="Tchart">
                                {player.state.health > 0 ? (
                                    <div className={"Tbar-" + player.state.health}></div>
                                ) : (
                                    <div className="Tbar-0"></div>
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
                    {teamCT.map((player, index) => (
                        <div className="CTplayerBlock" key={player.observer_slot}>
                            <div className="CTchart">
                                {player.state.health > 0 ? (
                                    <div className={"CTbar-" + player.state.health}></div>
                                ) : (
                                    <div className="CTbar-0"></div>
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
