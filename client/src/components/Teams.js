import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:5001");

export function Teams() {
    const [teamCT, setTeamCT] = useState(null);
    const [teamT, setTeamT] = useState(null);

    useEffect(() => {
        socket.on("CTTeam", (CTTeam) => {
            console.log("Setting CT team");
            setTeamCT(CTTeam);
        });

        socket.on("TTeam", (TTeam) => {
            console.log("Setting T team");
            setTeamT(TTeam);
        });
    });

    if (teamCT && teamT) {
        return (
            <div>
                <div className="Tplayers">
                    {teamT.map((player, index) => (
                        <tr
                            key={player.observer_slot}
                            style={{ backgroundColor: "rgba(0, 19, 127, 0.35)" }}
                        >
                            <div>
                                {" "}
                                {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                {player.match_stats.deaths}
                            </div>

                            <div>
                                {player.observer_slot}. {player.name} {player.state.health}{" "}
                                {player.state.armor} {player.state.helmet ? "HELMET" : "NO HELMET"}{" "}
                            </div>
                        </tr>
                    ))}
                </div>
                <div className="CTplayers">
                    {teamCT.map((player, index) => (
                        <tr
                            key={player.observer_slot}
                            style={{ backgroundColor: "rgba(0, 19, 127, 0.35)" }}
                        >
                            <div>
                                {" "}
                                {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                {player.match_stats.deaths}
                            </div>

                            <div>
                                {player.observer_slot}. {player.name} {player.state.health}{" "}
                                {player.state.armor} {player.state.helmet ? "HELMET" : "NO HELMET"}{" "}
                            </div>
                        </tr>
                    ))}
                </div>
            </div>
        );
    } else return <div></div>;
}

export default Teams;
