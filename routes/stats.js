var express = require('express');
var router = express.Router();
var request = require("request");
const API = require('call-of-duty-api')();
const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    host: '31.220.50.95',
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: 'warzoneranks'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

/* GET player stats. */
router.get('/:platform/:username', async function(req, res, next) {
    var platform = req.params.platform;
    var username = req.params.username;
    try {
        if (platform == 'all') {
            let data = await API.MWwz(username, 'xbl');
            res.json({error: false, data: data});
        } else {
            if (username == "og-savagee gamer" && platform == "xbl") {
                console.log("Banned");
                res.json({error: true, msg: "You've been banned from Warzone Ranks"});
                return true;
            }
            let data = await API.MWwz(username, platform);
            let kd = data.lifetime.mode.br.properties.kdRatio.toFixed(2);
            let kdRank;
            let kdPercentage;
            switch(true) {
                case (kd > 3.57):
                    kdRank = "Legend";
                    kdClass = "legend"
                    kdPercentage = "Top 0.1%";
                    break;
                case (kd > 2.08):
                    kdRank = "Master";
                    kdClass = "master"
                    kdPercentage = "Top 1%";
                    break;
                case (kd > 1.54):
                    kdRank = "Diamond 1";
                    kdClass = "diamond"
                    kdPercentage = "Top 5%";
                    break;
                case (kd > 1.34):
                    kdRank = "Diamond 2";
                    kdClass = "diamond"
                    kdPercentage = "Top 10%";
                    break;
                case (kd > 1.23):
                    kdRank = "Diamond 3";
                    kdClass = "diamond"
                    kdPercentage = "Top 15%";
                    break;
                case (kd > 1.14):
                    kdRank = "Diamond 4";
                    kdClass = "diamond"
                    kdPercentage = "Top 20%";
                    break;
                case (kd > 1.08):
                    kdRank = "Platinum 1";
                    kdClass = "platinum"
                    kdPercentage = "Top 25%";
                    break;
                case (kd > 1.02):
                    kdRank = "Platinum 2";
                    kdClass = "platinum"
                    kdPercentage = "Top 30%";
                    break;
                case (kd > 0.97):
                    kdRank = "Platinum 3";
                    kdClass = "platinum"
                    kdPercentage = "Top 35%";
                    break;
                case (kd > 0.92):
                    kdRank = "Platinum 4";
                    kdClass = "platinum"
                    kdPercentage = "Top 40%";
                    break;
                case (kd > 0.87):
                    kdRank = "Gold 1";
                    kdClass = "gold"
                    kdPercentage = "Top 45%";
                    break;
                case (kd > 0.83):
                    kdRank = "Gold 2";
                    kdClass = "gold"
                    kdPercentage = "Top 50%";
                    break;
                case (kd > 0.78):
                    kdRank = "Gold 3";
                    kdClass = "gold"
                    kdPercentage = "Bottom 50%";
                    break;
                case (kd > 0.74):
                    kdRank = "Gold 4";
                    kdClass = "gold"
                    kdPercentage = "Bottom 45%";
                    break;
                case (kd > 0.69):
                    kdRank = "Silver 1";
                    kdClass = "silver"
                    kdPercentage = "Bottom 40%";
                    break;
                case (kd > 0.64):
                    kdRank = "Silver 2";
                    kdClass = "silver"
                    kdPercentage = "Bottom 35%";
                    break;
                case (kd > 0.59):
                    kdRank = "Silver 3";
                    kdClass = "silver"
                    kdPercentage = "Bottom 30%";
                    break;
                case (kd > 0.53):
                    kdRank = "Silver 4";
                    kdClass = "silver"
                    kdPercentage = "Bottom 25%";
                    break;
                case (kd > 0.47):
                    kdRank = "Bronze 1";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 20%";
                    break;
                case (kd > 0.38):
                    kdRank = "Bronze 2";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 15%";
                    break;
                case (kd > 0.27):
                    kdRank = "Bronze 3";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 10%";
                    break;
                default: 
                    kdRank = "Bronze 4";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 5%";
                    break;
                
            }

            let wins = data.lifetime.mode.br.properties.wins;
            let winsRank;
            let winsPercentage;
            switch(true) {
                case (wins > 232):
                    winsRank  = "Legend";
                    winsClass = "legend"
                    winsPercentage = "Top 0.1%";
                    break;
                case (wins > 105):
                    winsRank  = "Master";
                    winsClass = "master"
                    winsPercentage = "Top 1%";
                    break;
                case (wins > 51):
                    winsRank  = "Diamond 1";
                    winsClass = "diamond"
                    winsPercentage = "Top 5%";
                    break;
                case (wins > 34):
                    winsRank  = "Diamond 2";
                    winsClass = "diamond"
                    winsPercentage = "Top 10%";
                    break;
                case (wins > 25):
                    winsRank  = "Diamond 3";
                    winsClass = "diamond"
                    winsPercentage = "Top 15%";
                    break;
                case (wins > 19):
                    winsRank  = "Diamond 4";
                    winsClass = "diamond"
                    winsPercentage = "Top 20%";
                    break;
                case (wins > 15):
                    winsRank  = "Platinum 1";
                    winsClass = "platinum"
                    winsPercentage = "Top 25%";
                    break;
                case (wins > 12):
                    winsRank  = "Platinum 2";
                    winsClass = "platinum"
                    winsPercentage = "Top 30%";
                    break;
                case (wins > 10):
                    winsRank  = "Platinum 3";
                    winsClass = "platinum"
                    winsPercentage = "Top 35%";
                    break;
                case (wins > 8):
                    winsRank  = "Platinum 4";
                    winsClass = "platinum"
                    winsPercentage = "Top 40%";
                    break;
                case (wins > 6):
                    winsRank  = "Gold 1";
                    winsClass = "gold"
                    winsPercentage = "Top 45%";
                    break;
                case (wins > 5):
                    winsRank  = "Gold 2";
                    winsClass = "gold"
                    winsPercentage = "Top 50%";
                    break;
                case (wins > 3):
                    winsRank  = "Gold 3";
                    winsClass = "gold"
                    winsPercentage = "Bottom 50%";
                    break;
                case (wins > 2):
                    winsRank  = "Gold 4";
                    winsClass = "gold"
                    winsPercentage = "Bottom 45%";
                    break;
                case (wins > 2):
                    winsRank  = "Silver 1";
                    winsClass = "silver"
                    winsPercentage = "Bottom 40%";
                    break;
                case (wins > 1):
                    winsRank  = "Silver 2";
                    winsClass = "silver"
                    winsPercentage = "Bottom 35%";
                    break;
                case (wins > 1):
                    winsRank  = "Silver 3";
                    winsClass = "silver"
                    winsPercentage = "Bottom 30%";
                    break;
                case (wins > 0):
                    winsRank  = "Silver 4";
                    winsClass = "silver"
                    winsPercentage = "Bottom 25%";
                    break;
                case (wins > 0):
                    winsRank  = "Bronze 1";
                    winsClass = "bronze"
                    winsPercentage = "Bottom 20%";
                    break;
                case (wins > 0):
                    winsRank  = "Bronze 2";
                    winsClass = "bronze"
                    winsPercentage = "Bottom 15%";
                    break;
                case (wins > 0):
                    winsRank  = "Bronze 3";
                    winsClass = "bronze"
                    winsPercentage = "Bottom 10%";
                    break;
                default: 
                    winsRank  = "Bronze 4";
                    winsClass = "bronze"
                    winsPercentage = "Bottom 5%";
                    break;
                
            }

            let kpg = data.lifetime.mode.br.properties.kills / data.lifetime.mode.br.properties.gamesPlayed;
            let kpgRank;
            let kpgPercentage;
            switch(true) {
                case (kpg > 8.93):
                    kpgRank = "Legend";
                    kpgClass = "legend"
                    kpgPercentage = "Top 0.1%";
                    break;
                case (kpg > 5.31):
                    kpgRank = "Master";
                    kpgClass = "master"
                    kpgPercentage = "Top 1%";
                    break;
                case (kpg > 4.02):
                    kpgRank = "Diamond 1";
                    kpgClass = "diamond"
                    kpgPercentage = "Top 5%";
                    break;
                case (kpg > 3.53):
                    kpgRank = "Diamond 2";
                    kpgClass = "diamond"
                    kpgPercentage = "Top 10%";
                    break;
                case (kpg > 3.24):
                    kpgRank = "Diamond 3";
                    kpgClass = "diamond"
                    kpgPercentage = "Top 15%";
                    break;
                case (kpg > 3.02):
                    kpgRank = "Diamond 4";
                    kpgClass = "diamond"
                    kpgPercentage = "Top 20%";
                    break;
                case (kpg > 2.84):
                    kpgRank = "Platinum 1";
                    kpgClass = "platinum"
                    kpgPercentage = "Top 25%";
                    break;
                case (kpg > 2.69):
                    kpgRank = "Platinum 2";
                    kpgClass = "platinum"
                    kpgPercentage = "Top 30%";
                    break;
                case (kpg > 2.55):
                    kpgRank = "Platinum 3";
                    kpgClass = "platinum"
                    kpgPercentage = "Top 35%";
                    break;
                case (kpg > 2.43):
                    kpgRank = "Platinum 4";
                    kpgClass = "platinum"
                    kpgPercentage = "Top 40%";
                    break;
                case (kpg > 2.30):
                    kpgRank = "Gold 1";
                    kpgClass = "gold"
                    kpgPercentage = "Top 45%";
                    break;
                case (kpg > 2.19):
                    kpgRank = "Gold 2";
                    kpgClass = "gold"
                    kpgPercentage = "Top 50%";
                    break;
                case (kpg > 2.07):
                    kpgRank = "Gold 3";
                    kpgClass = "gold"
                    kpgPercentage = "Bottom 50%";
                    break;
                case (kpg > 1.96):
                    kpgRank = "Gold 4";
                    kpgClass = "gold"
                    kpgPercentage = "Bottom 45%";
                    break;
                case (kpg > 1.84):
                    kpgRank = "Silver 1";
                    kpgClass = "silver"
                    kpgPercentage = "Bottom 40%";
                    break;
                case (kpg > 1.71):
                    kpgRank = "Silver 2";
                    kpgClass = "silver"
                    kpgPercentage = "Bottom 35%";
                    break;
                case (kpg > 1.57):
                    kpgRank = "Silver 3";
                    kpgClass = "silver"
                    kpgPercentage = "Bottom 30%";
                    break;
                case (kpg > 1.42):
                    kpgRank = "Silver 4";
                    kpgClass = "silver"
                    kpgPercentage = "Bottom 25%";
                    break;
                case (kpg > 1.24):
                    kpgRank = "Bronze 1";
                    kpgClass = "bronze"
                    kpgPercentage = "Bottom 20%";
                    break;
                case (kpg > 1.00):
                    kpgRank = "Bronze 2";
                    kpgClass = "bronze"
                    kpgPercentage = "Bottom 15%";
                    break;
                case (kpg > 0.70):
                    kpgRank = "Bronze 3";
                    kpgClass = "bronze"
                    kpgPercentage = "Bottom 10%";
                    break;
                default: 
                    kpgRank = "Bronze 4";
                    kpgClass = "bronze"
                    kpgPercentage = "Bottom 5%";
                    break;
                
            }
            var stats = {
                level: data.level,
                kd: data.lifetime.mode.br.properties.kdRatio.toFixed(2),
                wins: data.lifetime.mode.br.properties.wins,
                gamesPlayed: data.lifetime.mode.br.properties.gamesPlayed,
                killsPerGame: kpg.toFixed(2),
                weekly: {
                    kd: data.weekly.mode.br_all.properties.kdRatio.toFixed(2),
                    kills: data.weekly.mode.br_all.properties.kills,
                    killsPerGame: data.weekly.mode.br_all.properties.killsPerGame.toFixed(2)
                },
                ranking: {
                    kd: {
                        rank: kdRank,
                        class: kdClass,
                        percentage: kdPercentage
                    },
                    wins: {
                        rank: winsRank,
                        class: winsClass,
                        percentage: winsPercentage
                    },
                    killsPerGame: {
                        rank: kpgRank,
                        class: kpgClass,
                        percentage: kpgPercentage
                    }
                }
            }
            res.json({error: false, data: stats});
        }
    } catch(Error) {
        console.log(Error);
        res.json({error: true, msg: Error});
    }
});

router.get('/:platform/:username/matches', async function(req, res, next) {
    var platform = req.params.platform;
    var username = req.params.username;
    try {
        let data = await API.MWcombatwz(username, platform);
        var matches = [];
        let done = false;
        let countOfLoaded = 0;
        let errorLoadingMatches = false;
        var loadMatches = new Promise((resolve, reject) => {
            data.matches.forEach(async function(match) {
                matches[match.matchID] = {matchID: match.matchID};
                connection.query('SELECT * FROM matches WHERE match_id = ? ORDER BY id DESC LIMIT 1', match.matchID, async (err,rows) => {
                    if(err) throw err;
                  
                    if (rows && rows.length) {
                        let data = rows[0];
                        let newMatch = {
                            matchID: match.matchID,
                            mode: match.mode,
                            utcStartSeconds: match.utcStartSeconds,
                            playerStats: {
                                teamPlacement: match.playerStats.teamPlacement,
                                kills: match.playerStats.kills,
                                damageDone: match.playerStats.damageDone,
                                score: match.playerStats.score
                            },
                            ranking: {
                                averageKD: data.medianKD,
                                rank: data.rank,
                                class: data.class,
                                percentage: data.percentage
                            }
                        }
                        matches[match.matchID] = newMatch;
                    } else {
                        let newMatch = {
                            matchID: match.matchID,
                            mode: match.mode,
                            utcStartSeconds: match.utcStartSeconds,
                            playerStats: {
                                teamPlacement: match.playerStats.teamPlacement,
                                kills: match.playerStats.kills,
                                damageDone: match.playerStats.damageDone,
                                score: match.playerStats.score
                            },
                            ranking: {
                                averageKD: null,
                                rank: "CLICK TO RANK",
                                class: "unranked",
                                percentage: ""
                            }
                        }
                        matches[match.matchID] = newMatch;
                    }
                    countOfLoaded = countOfLoaded + 1;
                    if (data.matches.length == countOfLoaded || errorLoadingMatches) {
                        resolve();
                    }
                });
                
                
            });
        });
        
        loadMatches.then(function() {
            let newMatchArray = [];
            for (match in matches) {
                newMatchArray.push(matches[match]);
            }
            if (errorLoadingMatches) {
                res.json({error: true, msg: "Tracker.gg's API is having some problems, please try again in a few minutes"});
                return;
            } else {
                res.json({error: false, data: newMatchArray});
            }
        });
        
        
    } catch(Error) {
        console.log(Error);
        res.json({error: true, msg: Error});
    }
});

router.get('/match/:matchID', async function(req, res, next) {
    var matchID = req.params.matchID;
    try {
        let data = await API.MWFullMatchInfowz(matchID, 'xbl');
        res.json({error: false, data: data});
    } catch(Error) {
        console.log(Error);
        res.json({error: true, msg: Error});
    }
});

router.get('/famous', async function(req, res, next) {
    connection.query('SELECT * FROM famous', async (err,rows) => {
        if(err) throw err;
      
        console.log('Data received from Db:');
        console.log(rows);
        if (rows && rows.length) {
            let famousPlayers = [];
            rows.forEach(function(row) {
                let newFamousPlayer = {
                    name: row.name,
                    platform: row.platform,
                    username: row.username,
                    picture: row.profilePicture,
                    social: {
                        twitch: row.twitch,
                        facebook: row.fb,
                        twitter: row.twitter
                    }
                };
                famousPlayers.push(newFamousPlayer);
            })
            res.json({error: false, data: famousPlayers});
        } else {
            res.json({error: true, msg: "No famous players"});
        }
    });
});


module.exports = router;
