import "./../styles/Teams.scss";
import { useState } from "react";
import io from "socket.io-client";

import { ArmorHelmet, ArmorFull, Defuse, SmallBomb, Skull, LogoT, LogoCT, Bomb } from "../assets/Icons";
import { gunMap, NadeOrder } from "../assets/Weapons";
const socket = io("http://localhost:5001");

function getPrimaryWeapon(side, player) {
    //Returns image of primary weapon for a player
    var playerSide;
    if (side === "L") {
        playerSide = "GunL";
    } else {
        //Checks the side of the HUD that the player is at
        playerSide = "GunR";
    }

    if (player.weapons === null) {
        return <img alt="Primary Weapon" className={playerSide} src={gunMap.get("")}></img>;
    } //If player somehow doesn't have weapons
    //Don't know what would cause this, but it has led to crashes
    if (player.weapons.weapon_0 == null) {
        return <img alt="Primary Weapon" className={playerSide} src={gunMap.get("")}></img>;
    }
    //Checks if they have no knife
    //Which shouldn't happen either but this also caused crashes

    if (player.state.health === 0) {
        return <img alt="Primary Weapon" className={playerSide} src={gunMap.get("")}></img>;
    }
    //If player is dead, no need to render any image, just returns a blank png
    var gun;
    var x = "";
    var equipped = true; //Assumes weapon is equipped unless told otherwise
    Object.keys(player.weapons).forEach(function (key) {
        //Iterates through all weapons of the given player
        gun = player.weapons[key];
        if (
            gun.type === "Rifle" ||
            gun.type === "SniperRifle" ||
            gun.type === "Submachine Gun" ||
            gun.type === "Shotgun" ||
            gun.type === "Machine Gun"
        ) {
            //Checks all types of primary weapons to see if it is primary
            //Unfortunately the game doesn't give us a flag saying "primary: yes"
            x = gun.name;
            if (gun.state !== "active") {
                equipped = false;
                //If weapon is unequipped, set equipped to false
            }
        }
    });
    if (x === "") {
        //If we get here, then it means that there were no primary weapons
        //This loop then checks for any pistols
        Object.keys(player.weapons).forEach(function (key) {
            gun = player.weapons[key];
            if (gun.type === "Pistol") {
                x = gun.name;
                if (gun.state !== "active") {
                    //Checks if weapon is equipped
                    equipped = false;
                }
            }
        });
    }
    if (x === "") {
        //If we get here, then there are no pistols or primary weapons
        //Meaning there is only a knife and potentially utility
        if (player.weapons.weapon_0.state !== "active") {
            playerSide = playerSide + "u";
        } //If knife is unequipped, change playerSide so a different class will grey out the knife
        return (
            <img
  alt="knife"
  className={playerSide}
  src={gunMap.get(player.weapons.weapon_0.name)}
  />
        );
        //Return the knife icon, haven't tested yet with non-default knives but it should work
    }
    if (!equipped) {
        playerSide = playerSide + "u";
    }
    //Check is equipped, if not, change playerSide so it will be a different class
    return <img alt="weapon" className={playerSide} src={gunMap.get(x)}></img>; //Return image of weapon
}
function getSecondaryWeapon(side, player) {
    //Returns an img containing the secondary weapon of a player
    var playerSide;

    if (side === "L") {
        playerSide = "GunL2";
    } else {
        //Get the side of the HUD that the player is on, left or right
        playerSide = "GunR2";
    }
    //playerSide is the side the player is on the hud, left or right
    //L2 and R2 are classes for the secondary weapons, and are smaller
    //than the primary weapon icons
    var x = ""; //Initialize secondary weapon name to ""
    if (player.weapons === null) {
        //console.log("a");
        return <img alt="no weapon" className={playerSide} src={gunMap.get("")}></img>;
    }
    if (player.weapons.weapon_0 === null) {
        return <img alt="no weapon" className={playerSide} src={gunMap.get("")}></img>;
    }
    //Two checks just to make sure nothing crashes,
    //Honestly could probably get rid of one of these and nothing happens
    //Will look into removing later if there are performance issues

    if (!hasPrimary(player)) {
        return <img alt="no primary" className={playerSide} src={gunMap.get("")}></img>;
    } //If the player has no primary weapon, exit this function
    //Since the primary weapon in that case would just be their pistol/knife
    var gun;
    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (gun.type === "Pistol") {
            //Searches for a pistol, among all the player's weapons
            x = gun.name;
            if (gun.state === "active") {
                playerSide = playerSide + "e";
            }
            //If the weapon is equipped, add e to playerSide
            //GunR2e and GunL2e are also classes, which are identical to the non-e except they're not as opaque
        }
    });
    if (gunMap.get(x) !== null) {
        return <img alt="gun" className={playerSide} src={gunMap.get(x)}></img>; //Accesses the map storing all the gun's icons and returns the image
    }
    return <img alt="no gun" className={playerSide} src={gunMap.get(x)}></img>; //If you somehow get here, we have a huge problem
}
function hasPrimary(player) {
    //Function checks if the player has a primary weapon
    //Due to the TERRIBLE way that the game sends information of player weapons
    //There are not many better ways of doing this, sadly
    var primary = false;
    var gun;
    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (
            gun.type === "Rifle" ||
            gun.type === "SniperRifle" ||
            gun.type === "Submachine Gun" ||
            gun.type === "Shotgun" ||
            gun.type === "Machine Gun"
        ) {
            primary = true;
        }
        //Iterates through entire weapon list, and if a primary is found returns true
        //I tried putting a return statement here, and it broke everything so var primary stays
    });
    return primary; //Returns false otherwise
}
function hasKit(player) {
    if (player.team != "CT") {
        return;
    }

    if (player.state.defusekit != null) {
        if (player.state.defusekit == true) {
            return <Defuse />;
        }
    }
}
function getPlayerKills(player,side) {
    //Unused for now
    //Data to get player kills in the current round
    //is located at player.state.round_kills
}
function hasBomb(player) {

    if (player.team != "T") {
        return;
    }
    var s = false;
    Object.keys(player.weapons).forEach(function (key) {
        //Iterates through all weapons of the given player
        if(player.weapons[key].name == "weapon_c4") {
            s = true;
        }
    });
    if(s) {
        return <Bomb />;
    }
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
function getNades(side, player) {

    var playerSide;
    if (side === "L") {
        playerSide = "NadesL";
    } else {

        playerSide = "NadesR";
    }
    if (player.weapons === null) {
        return <div className="leftTeamNades"></div>;
    }
    if (player.weapons.weapon_0 === null) {
        return <div className="leftTeamNades"></div>;
    }
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
    if (nades[0] === "") {
        return;
    }
    for (const nade in nades) {
        if (nades[nade] !== "") {
            nades[nade] = NadeOrder.get(nades[nade]);
        }
    }
    nades.sort();
    nades.reverse();
    if (gunMap.get(x) !== null) {
        if (side == "L") {
            return leftTeamNades(nades);
        }
        return rightTeamNades(nades);
    }
    return <div className="leftTeamNades"><img alt="no nades" className={playerSide} src={gunMap.get(x)} /></div>;
}
function leftTeamNades(nades) {

    return (
    <div className="leftTeamNades">
        <img alt="nades" className={`Nade ${nades[3]}`} src={gunMap.get(nades[3])} />
        <img alt="nades" className={`Nade ${nades[2]}`} src={gunMap.get(nades[2])} />
        <img alt="nades" className={`Nade ${nades[1]}`} src={gunMap.get(nades[1])} />
        <img alt="nades" className={`Nade ${nades[0]}`} src={gunMap.get(nades[0])} />
    </div>
    );
}
function rightTeamNades(nades) {
    return (
    <div className="rightTeamNades">
        <img alt="nades" className={`Nade ${nades[3]}`} src={gunMap.get(nades[3])} />
        <img alt="nades" className={`Nade ${nades[2]}`} src={gunMap.get(nades[2])} />
        <img alt="nades" className={`Nade ${nades[1]}`} src={gunMap.get(nades[1])} />
        <img alt="nades" className={`Nade ${nades[0]}`} src={gunMap.get(nades[0])} />
    </div>
    );
}
function printHealthBar(side, player) {
    var x = ""
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
        if (!props.team || !props.team[0]) return <div></div>;

        let side = props.team === teamLeft ? "L" : "R";
        // console.log(props.team);
        // console.log(props.switched);

        return (
            <div className={side == "L" ? "Lplayers" : "Rplayers"}>
                {/* Checks if players are left or right side, misleading variable names */}
                {props.team.map((player, index) => (
                    <div
                        className={side == "L" ? "LplayerBlock" : "RplayerBlock"}
                        key={player.observer_slot}
                    >
                        <div
                            className={side == "L" ? "LArmor" : "RArmor"}
                            id={player.steamid === currentSpec?.steamid ? "spec" : ""}
                        >
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
                                    {player.match_stats.kills} / {player.match_stats.assists} /{" "}
                                    {player.match_stats.deaths}
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
