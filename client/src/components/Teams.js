import "./../styles/Teams.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import { ArmorHelmet, ArmorFull, Defuse, SmallBomb, Skull, LogoT, LogoCT } from '../assets/Icons';
import {weapon_ak47, weapon_aug, weapon_awp, weapon_bayonet, weapon_bizon, weapon_c4, weapon_cz75a, weapon_deagle, weapon_decoy, weapon_elite, weapon_famas, weapon_fiveseven, weapon_flashbang, weapon_g3sg1, weapon_galilar, weapon_glock, weapon_hegrenade, weapon_hkp2000, weapon_incgrenade, weapon_inferno, weapon_knife, weapon_knife_bayonet, weapon_knife_butterfly, weapon_knife_canis, weapon_knife_cord, weapon_knife_css, weapon_knife_falchion, weapon_knife_flip, weapon_knife_gut, weapon_knife_gypsy_jackknife, weapon_knife_karambit, weapon_knife_m9_bayonet, weapon_knife_outdoor, weapon_knife_push, weapon_knife_skeleton, weapon_knife_stiletto, weapon_knife_survival_bowie, weapon_knife_t, weapon_knife_tactical, weapon_knife_ursus, weapon_knife_widowmaker, weapon_m249, weapon_m4a1, weapon_m4a1_silencer, weapon_m4a1_silencer_off, weapon_mac10, weapon_mag7, weapon_molotov, weapon_mp5sd, weapon_mp7, weapon_mp9, weapon_negev, weapon_nova, weapon_out, weapon_p250, weapon_p90, weapon_revolver, weapon_sawedoff, weapon_scar20, weapon_sg556, weapon_smokegrenade, weapon_ssg08, weapon_taser, weapon_tec9, weapon_trigger_hurt, weapon_ump45, weapon_usp_silencer, weapon_usp_silencer_off, weapon_world, weapon_xm1014} from "../assets/Weapons";
const socket = io("http://localhost:5001");

function getPrimaryWeapon(player) {
    if(player.weapons == null) {
        return "";
    }
    if(player.weapons.weapon_0 == null) {
        return "";
    }
    var gun;
    var x = "";
    Object.keys(player.weapons).forEach(function(key) {
        gun = player.weapons[key];
        if(gun.type == "Rifle" || gun.type == "SniperRifle" || gun.type == "Submachine Gun" || gun.type == "Shotgun" || gun.type == "Machine Gun") {
            x = gun.name;
        }

    });
    if(x == "") {
        Object.keys(player.weapons).forEach(function(key) {
            gun = player.weapons[key];
            if(gun.type == "Pistol") {
                x = gun.name;
            }
        });
    }
    if(x == "") {
        x = player.weapon.weapon_0.name;
    }
    return x;
}
function getSecondaryWeapon(player) {
    if(player.weapons == null) {
        return "";
    }
    if(player.weapons.weapon_0 == null) {
        return "";
    }
    var gun;
    var x = "";
    Object.keys(player.weapons).forEach(function(key) {
        gun = player.weapons[key];
        if(gun.type == "Pistol") {
            x = gun.name;
        }
    });
    return x;
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
                                    <img className="GunL" src={weapon_awp}></img>
                                    <p className={side == "L" ? "GunL2" : "GunR2"}>
                                        {hasPrimary(player) ? getSecondaryWeapon(player) : ""}
                                        {}
                                    </p>
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
