import { gunMap, nadeOrder } from "../assets/Weapons";
import { Bomb, Defuse } from "../assets/Icons";

export function getPrimaryWeapon(side, player) {
    var playerSide = side === "L" ? "GunL" : "GunR";

    //If player somehow doesn't have weapons or a knife
    if (!player.weapons || !player.weapons.weapon_0) {
        return <img alt="Primary Weapon" className={playerSide} src={gunMap.get("")}></img>;
    }

    //If player is dead, no need to render any image, just returns a blank png
    if (player.state.health === 0) {
        return <img alt="Primary Weapon" className={playerSide} src={gunMap.get("")}></img>;
    }

    var gun;
    var primary = "";
    var equipped = true; //Assumes weapon is equipped unless told otherwise

    //Iterates through all weapons of the given player
    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];

        if (
            gun.type === "Rifle" ||
            gun.type === "SniperRifle" ||
            gun.type === "Submachine Gun" ||
            gun.type === "Shotgun" ||
            gun.type === "Machine Gun"
        ) {
            primary = gun.name;
            equipped = gun.state !== "active" ? false : true;
        }
    });

    //If we get here, then it means that there were no primary weapons (ie.  Rifles, Snipers, etc)
    if (primary === "") {
        //Looking for pistols
        Object.keys(player.weapons).forEach(function (key) {
            gun = player.weapons[key];

            if (gun.type === "Pistol") {
                primary = gun.name;
                equipped = gun.state !== "active" ? false : true;
            }
        });
    }

    //If we get here, then there are no pistols or primary weapons (ie. Just a knife or util)
    if (primary === "") {
        if (player.weapons.weapon_0.state !== "active") {
            playerSide = playerSide + "u"; //'u' implies the weapon is unequipped, used to gray out img
        }
        return (
            <img
                alt="knife"
                className={playerSide}
                src={gunMap.get(player.weapons.weapon_0.name)}
            />
        );
    }

    if (!equipped) {
        playerSide = playerSide + "u";
    }
    return <img alt="weapon" className={playerSide} src={gunMap.get(primary)}></img>;
}

export function getSecondaryWeapon(side, player) {
    var playerSide = side === "L" ? "GunL2" : "GunR2";

    var secondary = ""; //Initialize secondary weapon name to ""
    if (!player.weapons || !player.weapons.weapon_0) {
        return <img alt="Primary Weapon" className={playerSide} src={gunMap.get("")}></img>;
    }

    if (!hasPrimary(player)) {
        return <img alt="no primary" className={playerSide} src={gunMap.get("")}></img>;
    } 

    var gun;
    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (gun.type === "Pistol") {
            secondary = gun.name;
            if (gun.state !== "active") {
                playerSide = playerSide + "u";
            }
        }
    });
    if (gunMap.get(secondary)) {
        return <img alt="gun" className={playerSide} src={gunMap.get(secondary)}></img>;
    }
    return <img alt="no gun" className={playerSide} src={gunMap.get(secondary)}></img>;
}

function hasPrimary(player) {
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
    });
    return primary;
}

export function hasBomb(player) {
    if (player.team != "T") {
        return;
    }

    var s = false;
    Object.keys(player.weapons).forEach(function (key) {
        //Iterates through all weapons of the given player
        if (player.weapons[key].name == "weapon_c4") {
            s = true;
        }
    });

    if (s) {
        return <Bomb />;
    }
}

export function hasKit(player) {
    if (player.team != "CT") {
        return;
    }

    if (player.state.defusekit != null) {
        if (player.state.defusekit == true) {
            return <Defuse />;
        }
    }
}

export function getNades(side, player) {
    var playerSide = side === "L" ? "NadesL" : "NadesR";

    if (!player.weapons || !player.weapons.weapon_0) {
        return <div className="leftTeamNades"></div>;
    }

    var grenade = "";
    var gun;
    var nades = Array(4).fill("");
    var spot = 0;

    Object.keys(player.weapons).forEach(function (key) {
        gun = player.weapons[key];
        if (gun.type === "Grenade") {
            grenade = gun.name;
            nades[spot] = grenade;
            spot++;
        }
    });

    if (nades[0] === "") {
        return;
    }

    for (const nade in nades) {
        if (nades[nade] !== "") {
            nades[nade] = nadeOrder.get(nades[nade]);
        }
    }

    nades.sort();
    nades.reverse();

    if (gunMap.get(grenade) !== null) {
        if (side == "L") {
            return leftTeamNades(nades);
        }
        return rightTeamNades(nades);
    }

    return (
        <div className="leftTeamNades">
            <img alt="no nades" className={playerSide} src={gunMap.get(grenade)} />
        </div>
    );
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