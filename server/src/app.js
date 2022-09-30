const app = require('express')();
const http= require('http');
const socketIo = require('socket.io');
const config = require('./config');
const log = require("simple-node-logger").createSimpleLogger("csgo-gamestate.log");

app.use((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
});

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    if(req.method !== "POST"){
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(JSON.stringify(""));
    } 
    else {
        res.writeHead(200, { "Content-Type": "text/html" });
        log.info("[SERVER] Handling POST Request");

        req.on("data", (data) => {
            try{
                data = JSON.parse(data);

                if(connectionCount === 0){
                    log.error("[CLIENT] Frontend connection not found via socket");
                }

                if(!data.allplayers){
                    io.emit("spec", false);
                    log.error("[USER] User is not a spectator, refusing to send gamestate via socket");
                } 
                else {
                    io.emit("spec", true);
                    parseGamestate(data);
                }
            }
            catch (e) {
                log.error(`[SERVER] Error retrieving data from API: ${e}`);
            }
            
        })
    }
})

const io = socketIo(server, {
    cors: {
        origin: "*",
    }
})

var connectionCount = 0;
// Executed whenever someone connects to client
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
    if (!raw.allplayers || !raw.map || !raw.phase_countdowns || !raw.round) {
        return null;
    }

    parseTeams(raw);
    parseScoreBoard(raw);
    
    io.emit("currentPlayer", raw.player);

}

const parseTeams = (raw) => {
    let players = Object.entries(raw.allplayers).map(([id, player]) => ({
        steamid: id,
        name: player.name,
        team: player.team,
        observer_slot: player.observer_slot,
        state: player.state,
        match_stats: player.match_stats,
        weapons: player.weapons,
    }));

    let ctTeam = players.filter((p) => p.team === "CT");
    let tTeam = players.filter((p) => p.team === "T");

    io.emit("ctTeam", ctTeam);
    io.emit("tTeam", tTeam);
}

const parseScoreBoard = (raw) => {
    let scoreboard = {
        prevState: raw.previously,
        bomb: raw.bomb,
        mapInfo: raw.map,
        phases: raw.phase_countdowns
    }

    let time = parseInt(scoreboard.phases.phase_ends_in);
    scoreboard.phases.phase_ends_in = parseInt(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60);

    io.emit("scoreboard", scoreboard);
}

server.listen(config.application.port, config.application.host);
log.info(`[SYSTEM] Monitoring CS:GO on: ${config.application.host}:${config.application.port}`);
module.exports = server;