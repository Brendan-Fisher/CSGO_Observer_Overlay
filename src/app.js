const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const cors = require('cors');
const router = express.Router();
const config = require('./config');
const log = require('simple-node-logger').createSimpleLogger('csgo-gamestate.log');
const http = require('http');
const EventEmitter = require('events');
const socketIo = require("socket.io");

require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
})

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
    bombtimer: false
};

var all_data;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method == 'POST') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        log.trace("Handling POST Request");

        req.on('data', (data) => {
            try {
                //console.log(JSON.parse(data));

                generalProcessData(JSON.parse(data.toString()));

                if (connectionCount === 0) {
                    log.error('[SYSTEM] Frontend connection not found via socket')
                }
                else if (!JSON.parse(data).allplayers) {
                    log.info('[SYSTEM] Player is not a spectator, refusing to send information via socket')
                    io.emit("err");
                }
                else {
                    io.emit("update", JSON.parse(data.toString()));
                    log.info('[SYSTEM] Sent data to frontend via socket')
                }
                if (config.application.logLevel === "trace" || config.application.logLevel === "debug") {
                    fs.writeFile(`${__dirname}/export/${JSON.parse(data.toString()).provider.timestamp}.json`, data.toString(), (err) => {
                        if (err) {
                            return log.error(`[FILE] Error writing file: ${err}`);
                        }
                    });
                }
            } catch (e) {
                log.error(`[WEBDATA] Error retrieving data from API: ${e}`)
            }
        });

        req.on('end', () => {
            res.end('');
        })
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(JSON.stringify(all_data));
    }

});

const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});

var connectionCount = 0;
//Whenever someone connects this gets executed
io.on('connection', (socket) => {
    log.info('A user connected');
    connectionCount++;
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
        log.info('A user disconnected');
        connectionCount--;
    });
});

function generalProcessData(data) {
    all_data = data;
    if (typeof data.map !== "undefined") {
        log.trace("processMap");

        if (data.map.name !== general_data.map || data.map.mode !== general_data.game_mode) {
            log.trace(`[MAP] Map change detected: ${data.map.name}, Game Mode: ${data.map.mode}`);
        }

        general_data.map = data.map.name;
        general_data.game_mode = data.map.mode;
        general_data.round = data.map.round;
    }

    if (typeof data.added !== "undefined") {
        if (typeof data.added.round !== "undefined") {
            if (typeof data.added.round.win_team !== "undefined" && data.added.round.win_team) {
                processRoundEnd(data);
                log.trace("processRoundEnd");
            }
        }
    }

    if (typeof data.previously !== "undefined") {
        if (typeof data.previously.map !== "undefined") {
            if (typeof data.previously.map.phase !== "undefined") {
                processMapEnd(data);
                log.trace("processMapEnd");
            }
        }
    }

    if (typeof data.round !== "undefined") {
        if (typeof data.round.bomb !== "undefined") {
            processBombStatus(data);
            log.trace("processBombStatus");
        }
    }

    if (typeof data.player !== "undefined") {
        if (typeof data.player.steamid !== "undefined") {
            processPlayerId(data);
            log.trace("processPlayerId");
        }
    }
}

/**
* Process when the round has ended
* @param data
*/
function processRoundEnd(data) {
    const team_won = data.round.win_team === 'T' ? 'Terrorists' : 'Counter-Terrorists';
    const ct_score = data.round.win_team === 'CT' ? data.map.team_ct.score + 1 : data.map.team_ct.score;
    const t_score = data.round.win_team === 'T' ? data.map.team_t.score + 1 : data.map.team_t.score;
    let reason_won = false;

    if (data.round.bomb === 'exploded') {
        reason_won = 'bombing a bombsite';
    } else if (data.round.bomb === 'defused') {
        reason_won = 'defusing the bomb';
    } else {
        reason_won = 'killing the opposition';
    }

    if (general_data.bombtimer !== false) {
        clearInterval(general_data.bombtimer);
        general_data.bombtimer = false;
        general_data.bombtime = config.csgo.bombtime;
    }

    log.info(`[ROUND_END] ${team_won} won by ${reason_won} (CT ${ct_score}-${t_score} T)`);
}

/**
* Process when the map has ended
* @param data
*/
function processMapEnd(data) {
    if (data.previously.map.phase === "live" && data.map.phase === "gameover") {
        let winner = false;
        const ct_score = data.round.win_team === 'CT' ? data.map.team_ct.score + 1 : data.map.team_ct.score;
        const t_score = data.round.win_team === 'T' ? data.map.team_t.score + 1 : data.map.team_t.score;

        if (ct_score > t_score) {
            winner = 'Counter-Terrorists win!';
        } else if (t_score > ct_score) {
            winner = 'Terrorists win!';
        } else {
            winner = "It's a tie!";
        }

        log.info(`[MAP_END] ${data.map.name} over, ${winner}`);
    }
}

/**
* Process when bomb status changes
* @param data
*/
function processBombStatus(data) {
    if (data.round.bomb === "planted") {
        if (general_data.bombtimer === false) {
            log.info(`[BOMB] Status: ${data.round.bomb}! ${config.csgo.bombtime} seconds to explosion`);
            general_data.bombtimer = setInterval(() => {
                general_data.bombtime = general_data.bombtime - 1;
                log.info(`[BOMB] ${general_data.bombtime} seconds to explosion`);

                if (general_data.bombtime === 0) {
                    clearInterval(general_data.bombtimer);
                    general_data.bombtimer = false;
                    general_data.bombtime = config.csgo.bombtime;
                }
            }, 1000);
        }
    }

    if (data.round.bomb === "exploded") {
        log.info(`[BOMB] Status: ${data.round.bomb}`);

        if (general_data.bombtimer !== false) {
            clearInterval(general_data.bombtimer);
            general_data.bombtimer = false;
            general_data.bombtime = config.csgo.bombtime;
        }
    }

    if (data.round.bomb === "defused") {
        log.info(`[BOMB] Status: ${data.round.bomb}`);

        if (general_data.bombtimer !== false) {
            clearInterval(general_data.bombtimer);
            general_data.bombtimer = false;
            general_data.bombtime = config.csgo.bombtime;
        }
    }
}

/**
* Process when playerid had been found
* @param data
*/
function processPlayerId(data) {
    if (!general_data.player_ids.includes(data.player.steamid)) {
        general_data.player_ids.push(data.player.steamid);
        general_data.players.push({ id: data.player.steamid, name: data.player.name });
        log.info(`[PLAYER] New player found: ${data.player.steamid} (${data.player.name})`);

        /*
        fs.writeFile(`${__dirname}/export/players.json`, JSON.stringify(general_data.players), (err) => {
            if (err) {
                return log.error(`[FILE] Error writing file: ${err}`);
            }
        });
        */
    }
}

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

server.listen(config.application.port, config.application.host);
log.info(`[SYSTEM] Monitoring CS:GO on: ${config.application.host}:${config.application.port}`);
