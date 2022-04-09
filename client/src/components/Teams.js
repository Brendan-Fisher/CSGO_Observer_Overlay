import "./../styles/Teams.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import { ArmorHelmet, ArmorFull, Defuse, SmallBomb, Skull, LogoT, LogoCT } from '../assets/Icons';
import {gunMap} from '../assets/Weapons';
const socket = io("http://localhost:5001");


function getPrimaryWeapon(side,player) {
    //Returns image of primary weapon for a player
    var playerSide;
    if(side == "L") {
        playerSide = "GunL";
    } else { //Checks the side of the HUD that the player is at
        playerSide = "GunR";
    }

    if(player.weapons == null) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    } //If player somehow doesn't have weapons
    //Don't know what would cause this, but it has led to crashes
    if(player.weapons.weapon_0 == null) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    //Checks if they have no knife
    //Which shouldn't happen either but this also caused crashes

    if(player.state.health == 0) {
         return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    //If player is dead, no need to render any image, just returns a blank png
    var gun;
    var x = "";
    var equipped = true; //Assumes weapon is equipped unless told otherwise
    Object.keys(player.weapons).forEach(function(key) {
        //Iterates through all weapons of the given player
        gun = player.weapons[key];
        if(gun.type == "Rifle" || gun.type == "SniperRifle" || gun.type == "Submachine Gun" || gun.type == "Shotgun" || gun.type == "Machine Gun") {
            //Checks all types of primary weapons to see if it is primary
            //Unfortunately the game doesn't give us a flag saying "primary: yes"
            x = gun.name;
            if(gun.state != "active") {
                equipped = false;
                //If weapon is unequipped, set equipped to false
            }
        }

    });
    if(x == "") { //If we get here, then it means that there were no primary weapons
        //This loop then checks for any pistols
        Object.keys(player.weapons).forEach(function(key) {
            gun = player.weapons[key];
            if(gun.type == "Pistol") {
                x = gun.name;
                if(gun.state != "active") {//Checks if weapon is equipped
                    equipped = false;
                }
            }
        });
    }
    if(x == "") { //If we get here, then there are no pistols or primary weapons
        //Meaning there is only a knife and potentially utility
        if(player.weapons.weapon_0.state != "active") {
            playerSide=playerSide + "u";
        } //If knife is unequipped, change playerSide so a different class will grey out the knife
        return(<img className={playerSide} src={gunMap.get(player.weapons.weapon_0.name)}></img>);
        //Return the knife icon, haven't tested yet with non-default knives but it should work
    }
    if(!equipped) {
        playerSide=playerSide + "u";
    }
    //Check is equipped, if not, change playerSide so it will be a different class
    return(<img className={playerSide} src={gunMap.get(x)}></img>); //Return image of weapon
}
function getSecondaryWeapon(side,player) { //Returns an img containing the secondary weapon of a player
    var playerSide;

    if(side == "L") {
        playerSide = "GunL2";
    } else { //Get the side of the HUD that the player is on, left or right
        playerSide = "GunR2";
    }
    //playerSide is the side the player is on the hud, left or right
    //L2 and R2 are classes for the secondary weapons, and are smaller
    //than the primary weapon icons
    var x = ""; //Initialize secondary weapon name to ""
    if(player.weapons == null) {
        console.log("a");
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    if(player.weapons.weapon_0 == null) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    }
    //Two checks just to make sure nothing crashes,
    //Honestly could probably get rid of one of these and nothing happens
    //Will look into removing later if there are performance issues

    if(!hasPrimary(player)) {
        return (<img className={playerSide} src={gunMap.get("")}></img>);
    } //If the player has no primary weapon, exit this function
    //Since the primary weapon in that case would just be their pistol/knife
    var gun;
    Object.keys(player.weapons).forEach(function(key) {
        gun = player.weapons[key];
        if(gun.type == "Pistol") { //Searches for a pistol, among all the player's weapons
            x = gun.name;
            if(gun.state == "active") {
                playerSide = playerSide + "e";
            }
            //If the weapon is equipped, add e to playerSide
            //GunR2e and GunL2e are also classes, which are identical to the non-e except they're not as opaque
        }
    });
    if(gunMap.get(x) != null) {
        return(<img className={playerSide} src={gunMap.get(x)}></img>); //Accesses the map storing all the gun's icons and returns the image
    }
    return (<img className={playerSide} src={gunMap.get(x)}></img>); //If you somehow get here, we have a huge problem

}
function hasPrimary(player) {
    //Function checks if the player has a primary weapon
    //Due to the TERRIBLE way that the game sends information of player weapons
    //There are not many better ways of doing this, sadly
    var primary = false;
    var gun;
    Object.keys(player.weapons).forEach(function(key) {
        gun = player.weapons[key];
        if(gun.type == "Rifle" || gun.type == "SniperRifle" || gun.type == "Submachine Gun" || gun.type == "Shotgun" || gun.type == "Machine Gun") {
            primary = true;
        }
        //Iterates through entire weapon list, and if a primary is found returns true
        //I tried putting a return statement here, and it broke everything so var primary stays
    });
    return primary; //Returns false otherwise
}
function hasKit(player){
    if(player.team != "CT") {
        return;
    }

    if(player.state.defusekit != null) {
        if(player.state.defusekit == true ) {
            return <Defuse />
        }
    }
}
function printArmorKitHealth (player,side) {
    if(side != "L") {
        return<div> <p
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
            {hasKit(player)}
        </div>
    }
    return<div>

        <p
      style={{
          color: player.state.health > 50 ? "white" : player.state.health > 20 ? "orange" : "red",
      }}
    >
        {player.state.health}
    </p>{hasKit(player)}
    {player.state.helmet ? (
      <ArmorHelmet />
    ) : (
      player.state.armor > 0 && <ArmorFull />
    )}

    </div>
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
                    {/* Checks if players are left or right side, misleading variable names */}
                    {props.team.map((player, index) => (
                        <div className={side == "L" ? "CTplayerBlock" : "TplayerBlock"} key={player.observer_slot}>
                            <div className={side == "L" ? "CTArmor" : "TArmor"} id={player.steamid === currentSpec.steamid ? "spec" : ""}>
                                {player.state.health > 0 ? (

                                    <div>
                                        {printArmorKitHealth(player,side)}
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
