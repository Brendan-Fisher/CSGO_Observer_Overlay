const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const cors = require("cors");
const router = express.Router();
const config = require("./config");
const log = require("simple-node-logger").createSimpleLogger("csgo-gamestate.log");
const http = require("http");
const EventEmitter = require("events");
const socketIo = require("socket.io");

require("dotenv").config();

const middlewares = require("./middlewares");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
});

/**
 * Set global vars for later use
 * @type {{game_mode: boolean, map: boolean, round: number, players: Array, player_ids: Array, bombtime: number, bombtimer: boolean}}
 */
let general_data = {
    game_mode: false,
    map: false,
    round: 0,
    players: [],
    player_ids: [],
    bombtime: config.csgo.bombtime,
    bombtimer: false,
};

var all_data;

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (req.method == "POST") {
        res.writeHead(200, { "Content-Type": "text/html" });
        log.trace("Handling POST Request");

        req.on("data", (data) => {
            try {
                let jsonData;
                if (connectionCount === 0) {
                    log.error("[SYSTEM] Frontend connection not found via socket");
                } else if (!(jsonData = JSON.parse(data)).allplayers) {
                    io.emit("spec", false);
                    log.info("[SYSTEM] Player is not a spectator, refusing to send information via socket");
                } else {
                    io.emit("spec", true);
                    parseGamestate(jsonData);
                    log.info("[SYSTEM] Sent data to frontend via socket");
                }
                if (
                    config.application.logLevel === "trace" ||
                    config.application.logLevel === "debug"
                ) {
                    fs.writeFile(
                        `${__dirname}/export/${JSON.parse(data.toString()).provider.timestamp
                        }.json`,
                        data.toString(),
                        (err) => {
                            if (err) {
                                return log.error(`[FILE] Error writing file: ${err}`);
                            }
                        }
                    );
                }
            } catch (e) {
                log.error(`[WEBDATA] Error retrieving data from API: ${e}`);
            }
        });

        req.on("end", () => {
            res.end("");
        });
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(JSON.stringify(all_data));
    }
});

const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

var connectionCount = 0;
//Whenever someone connects this gets executed
io.on("connection", (socket) => {
    log.info("A user connected");
    connectionCount++;
    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", () => {
        log.info("A user disconnected");
        connectionCount--;
    });
});

const parseGamestate = (raw) => {
    //console.log(raw);
    if (!raw.allplayers || !raw.map || !raw.phase_countdowns) {
        return null;
    }

    let scoreboard = {
        mapInfo: raw.map,
        phaseInfo: raw.phase_countdowns,
    };

    parseScoreboard(scoreboard);

    let playerInfo = {
        allplayers: raw.allplayers,
        player: raw.player,
        numrounds: raw.map.round
    };
    parseMinimap(raw);
    parseADR(raw);
    parsePlayers(playerInfo);
};

var playersMatchDamage = new Map();

var roundOverFlag = false;
const parseADR = (raw) => {
    //console.log(raw);
    if (!raw.allplayers || !raw.map || !raw.phase_countdowns || !raw.round) {
        return null;
    }
    // update players adr at the end of every round
    if (!roundOverFlag && raw.round.phase === "over") {
        Object.entries(raw.allplayers).map(([id, player]) => {

            if (playersMatchDamage.has(id)) {
                playersMatchDamage.set(id, parseInt(player.state.round_totaldmg) + parseInt(playersMatchDamage.get(id)));
            }
            else {
                playersMatchDamage.set(id, parseInt(player.state.round_totaldmg));
            }

        });

    }
    // if player is new, make their adr 0.
    else if (raw.round.phase !== "over") {
        Object.entries(raw.allplayers).map(([id, player]) => {
            if (!playersMatchDamage.has(id)) playersMatchDamage.set(id, 0);
        });
    }

    if (raw.round.phase === "over") {
        roundOverFlag = true;
    } else if (roundOverFlag) roundOverFlag = false;
}

const parseScoreboard = (raw) => {
    //log.info("Parsing Scoreboard");

    let scoreboard = {
        phase: raw.mapInfo.phase,
        round: raw.mapInfo.round,
        CTScore: raw.mapInfo.team_ct.score,
        TScore: raw.mapInfo.team_t.score,
        CTName: "CT",
        TName: "T",
        phase_ends_in: raw.phaseInfo.phase_ends_in < 0 ? 0 : raw.phaseInfo.phase_ends_in,
        phaseInfo: raw.phaseInfo,
    };

    let time = parseInt(scoreboard.phase_ends_in - 0.2) + 1; // 0.2 for delay generated from communication
    scoreboard.phase_ends_in =
        parseInt(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60);

    io.emit("scoreboard", scoreboard);
};

const parseMinimap = (raw) => {

    let map = {
        mapinfo: raw.map,
        playerLocation: raw.allplayers,
    };

    io.emit("map", map);
};

const parsePlayers = (raw) => {
    //log.info(`Sending player info`);
    let players = Object.entries(raw.allplayers).map(([id, player]) => ({
        steamid: id,
        name: player.name,
        team: player.team,
        observer_slot: player.observer_slot,
        state: player.state,
        match_stats: player.match_stats,
        weapons: player.weapons,
        position: player.position,
        forward: player.forward,
    }));

    // Set ADRs to 0 at beginning of game
    for (const p of players) {
        p.match_stats.adr = raw.numrounds === 0 ? 0 :
            parseInt(parseInt(playersMatchDamage.get(p.steamid)) / parseInt(raw.numrounds));
    }

    // Set ADR of current player
    players.find(p => p.steamid === raw.player.steamid) ?
        raw.player.match_stats.adr = parseInt(parseInt(playersMatchDamage.get(raw.player.steamid)) / parseInt(raw.numrounds))
        : 0;

    // must ensure 5v5
    let leftTeam = players.filter((p) => p.observer_slot < 6 && p.observer_slot !== 0);
    let rightTeam = players.filter((p) => p.observer_slot >= 6 || p.observer_slot === 0);


    raw.numrounds >= 15 ? io.emit("switchedSides", true) : io.emit("switchedSides", false)

    io.emit("leftTeam", leftTeam);
    io.emit("rightTeam", rightTeam);
    io.emit("player", raw.player);
    io.emit("playerList", players);
};

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

server.listen(config.application.port, config.application.host);
log.info(`[SYSTEM] Monitoring CS:GO on: ${config.application.host}:${config.application.port}`);
module.exports = server;
