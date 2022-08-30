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
