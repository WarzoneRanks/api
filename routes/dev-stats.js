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
                    kdRank = "GOD Tier";
                    kdClass = "legend"
                    kdPercentage = "Top 0.1%";
                    break;
                case (kd > 2.08):
                    kdRank = "S+ Tier";
                    kdClass = "master"
                    kdPercentage = "Top 1%";
                    break;
                case (kd > 1.54):
                    kdRank = "S Tier";
                    kdClass = "diamond"
                    kdPercentage = "Top 5%";
                    break;
                case (kd > 1.34):
                    kdRank = "S Tier";
                    kdClass = "diamond"
                    kdPercentage = "Top 10%";
                    break;
                case (kd > 1.23):
                    kdRank = "S Tier";
                    kdClass = "diamond"
                    kdPercentage = "Top 15%";
                    break;
                case (kd > 1.14):
                    kdRank = "S Tier";
                    kdClass = "diamond"
                    kdPercentage = "Top 20%";
                    break;
                case (kd > 1.08):
                    kdRank = "A Tier";
                    kdClass = "platinum"
                    kdPercentage = "Top 25%";
                    break;
                case (kd > 1.02):
                    kdRank = "A Tier";
                    kdClass = "platinum"
                    kdPercentage = "Top 30%";
                    break;
                case (kd > 0.97):
                    kdRank = "A Tier";
                    kdClass = "platinum"
                    kdPercentage = "Top 35%";
                    break;
                case (kd > 0.92):
                    kdRank = "A Tier";
                    kdClass = "platinum"
                    kdPercentage = "Top 40%";
                    break;
                case (kd > 0.87):
                    kdRank = "B Tier";
                    kdClass = "gold"
                    kdPercentage = "Top 45%";
                    break;
                case (kd > 0.83):
                    kdRank = "B Tier";
                    kdClass = "gold"
                    kdPercentage = "Top 50%";
                    break;
                case (kd > 0.78):
                    kdRank = "B Tier";
                    kdClass = "gold"
                    kdPercentage = "Bottom 50%";
                    break;
                case (kd > 0.74):
                    kdRank = "B Tier";
                    kdClass = "gold"
                    kdPercentage = "Bottom 45%";
                    break;
                case (kd > 0.69):
                    kdRank = "C Tier";
                    kdClass = "silver"
                    kdPercentage = "Bottom 40%";
                    break;
                case (kd > 0.64):
                    kdRank = "C Tier";
                    kdClass = "silver"
                    kdPercentage = "Bottom 35%";
                    break;
                case (kd > 0.59):
                    kdRank = "C Tier";
                    kdClass = "silver"
                    kdPercentage = "Bottom 30%";
                    break;
                case (kd > 0.53):
                    kdRank = "C Tier";
                    kdClass = "silver"
                    kdPercentage = "Bottom 25%";
                    break;
                case (kd > 0.47):
                    kdRank = "D Tier";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 20%";
                    break;
                case (kd > 0.38):
                    kdRank = "D Tier";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 15%";
                    break;
                case (kd > 0.27):
                    kdRank = "D Tier";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 10%";
                    break;
                default: 
                    kdRank = "D Tier";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 5%";
                    break;
                
            }

            let wins = data.lifetime.mode.br.properties.wins;
            let winsRank;
            let winsPercentage;
            switch(true) {
                case (wins > 232):
                    winsRank  = "GOD Tier";
                    winsClass = "legend"
                    winsPercentage = "Top 0.1%";
                    break;
                case (wins > 105):
                    winsRank  = "S+ Tier";
                    winsClass = "master"
                    winsPercentage = "Top 1%";
                    break;
                case (wins > 51):
                    winsRank  = "S Tier";
                    winsClass = "diamond"
                    winsPercentage = "Top 5%";
                    break;
                case (wins > 34):
                    winsRank  = "S Tier";
                    winsClass = "diamond"
                    winsPercentage = "Top 10%";
                    break;
                case (wins > 25):
                    winsRank  = "S Tier";
                    winsClass = "diamond"
                    winsPercentage = "Top 15%";
                    break;
                case (wins > 19):
                    winsRank  = "S Tier";
                    winsClass = "diamond"
                    winsPercentage = "Top 20%";
                    break;
                case (wins > 15):
                    winsRank  = "A Tier";
                    winsClass = "platinum"
                    winsPercentage = "Top 25%";
                    break;
                case (wins > 12):
                    winsRank  = "A Tier";
                    winsClass = "platinum"
                    winsPercentage = "Top 30%";
                    break;
                case (wins > 10):
                    winsRank  = "A Tier";
                    winsClass = "platinum"
                    winsPercentage = "Top 35%";
                    break;
                case (wins > 8):
                    winsRank  = "A Tier";
                    winsClass = "platinum"
                    winsPercentage = "Top 40%";
                    break;
                case (wins > 6):
                    winsRank  = "B Tier";
                    winsClass = "gold"
                    winsPercentage = "Top 45%";
                    break;
                case (wins > 5):
                    winsRank  = "B Tier";
                    winsClass = "gold"
                    winsPercentage = "Top 50%";
                    break;
                case (wins > 3):
                    winsRank  = "B Tier";
                    winsClass = "gold"
                    winsPercentage = "Bottom 50%";
                    break;
                case (wins > 2):
                    winsRank  = "B Tier";
                    winsClass = "gold"
                    winsPercentage = "Bottom 45%";
                    break;
                case (wins > 2):
                    winsRank  = "C Tier";
                    winsClass = "silver"
                    winsPercentage = "Bottom 40%";
                    break;
                case (wins > 1):
                    winsRank  = "C Tier";
                    winsClass = "silver"
                    winsPercentage = "Bottom 35%";
                    break;
                case (wins > 1):
                    winsRank  = "C Tier";
                    winsClass = "silver"
                    winsPercentage = "Bottom 30%";
                    break;
                case (wins > 0):
                    winsRank  = "C Tier";
                    winsClass = "silver"
                    winsPercentage = "Bottom 25%";
                    break;
                case (wins > 0):
                    winsRank  = "D Tier";
                    winsClass = "bronze"
                    winsPercentage = "Bottom 20%";
                    break;
                case (wins > 0):
                    winsRank  = "D Tier";
                    winsClass = "bronze"
                    winsPercentage = "Bottom 15%";
                    break;
                case (wins > 0):
                    winsRank  = "D Tier";
                    winsClass = "bronze"
                    winsPercentage = "Bottom 10%";
                    break;
                default: 
                    winsRank  = "D Tier";
                    winsClass = "bronze"
                    winsPercentage = "Bottom 5%";
                    break;
                
            }

            let kpg = data.lifetime.mode.br.properties.kills / data.lifetime.mode.br.properties.gamesPlayed;
            let kpgRank;
            let kpgPercentage;
            switch(true) {
                case (kpg > 8.93):
                    kpgRank = "GOD Tier";
                    kpgClass = "legend"
                    kpgPercentage = "Top 0.1%";
                    break;
                case (kpg > 5.31):
                    kpgRank = "S+ Tier";
                    kpgClass = "master"
                    kpgPercentage = "Top 1%";
                    break;
                case (kpg > 4.02):
                    kpgRank = "S Tier";
                    kpgClass = "diamond"
                    kpgPercentage = "Top 5%";
                    break;
                case (kpg > 3.53):
                    kpgRank = "S Tier";
                    kpgClass = "diamond"
                    kpgPercentage = "Top 10%";
                    break;
                case (kpg > 3.24):
                    kpgRank = "S Tier";
                    kpgClass = "diamond"
                    kpgPercentage = "Top 15%";
                    break;
                case (kpg > 3.02):
                    kpgRank = "S Tier";
                    kpgClass = "diamond"
                    kpgPercentage = "Top 20%";
                    break;
                case (kpg > 2.84):
                    kpgRank = "A Tier";
                    kpgClass = "platinum"
                    kpgPercentage = "Top 25%";
                    break;
                case (kpg > 2.69):
                    kpgRank = "A Tier";
                    kpgClass = "platinum"
                    kpgPercentage = "Top 30%";
                    break;
                case (kpg > 2.55):
                    kpgRank = "A Tier";
                    kpgClass = "platinum"
                    kpgPercentage = "Top 35%";
                    break;
                case (kpg > 2.43):
                    kpgRank = "A Tier";
                    kpgClass = "platinum"
                    kpgPercentage = "Top 40%";
                    break;
                case (kpg > 2.30):
                    kpgRank = "B Tier";
                    kpgClass = "gold"
                    kpgPercentage = "Top 45%";
                    break;
                case (kpg > 2.19):
                    kpgRank = "B Tier";
                    kpgClass = "gold"
                    kpgPercentage = "Top 50%";
                    break;
                case (kpg > 2.07):
                    kpgRank = "B Tier";
                    kpgClass = "gold"
                    kpgPercentage = "Bottom 50%";
                    break;
                case (kpg > 1.96):
                    kpgRank = "B Tier";
                    kpgClass = "gold"
                    kpgPercentage = "Bottom 45%";
                    break;
                case (kpg > 1.84):
                    kpgRank = "C Tier";
                    kpgClass = "silver"
                    kpgPercentage = "Bottom 40%";
                    break;
                case (kpg > 1.71):
                    kpgRank = "C Tier";
                    kpgClass = "silver"
                    kpgPercentage = "Bottom 35%";
                    break;
                case (kpg > 1.57):
                    kpgRank = "C Tier";
                    kpgClass = "silver"
                    kpgPercentage = "Bottom 30%";
                    break;
                case (kpg > 1.42):
                    kpgRank = "C Tier";
                    kpgClass = "silver"
                    kpgPercentage = "Bottom 25%";
                    break;
                case (kpg > 1.24):
                    kpgRank = "D Tier";
                    kpgClass = "bronze"
                    kpgPercentage = "Bottom 20%";
                    break;
                case (kpg > 1.00):
                    kpgRank = "D Tier";
                    kpgClass = "bronze"
                    kpgPercentage = "Bottom 15%";
                    break;
                case (kpg > 0.70):
                    kpgRank = "D Tier";
                    kpgClass = "bronze"
                    kpgPercentage = "Bottom 10%";
                    break;
                default: 
                    kpgRank = "D Tier";
                    kpgClass = "bronze"
                    kpgPercentage = "Bottom 5%";
                    break;
                
            }

            connection.query(`SELECT * FROM users WHERE platform = '${platform}' AND username = '${username}' ORDER BY id DESC LIMIT 1`, async (err,rows) => {
                if(err) throw err;
              
                if (rows && rows.length) {
                    let roleData = rows[0];
                    var roles = [];
                    let socials = [];
                    if (roleData.twitch != null && roleData.twitch != '') {
                        socials.push({
                            name: "twitch",
                            username: roleData.twitch
                        });
                    }
                    if (roleData.twitter != null && roleData.twitter != '') {
                        socials.push({
                            name: "twitter",
                            username: roleData.twitter
                        });
                    }
                    if (roleData.owner == 1) {
                        roles.push({
                            name: "Owner",
                            className: "fa fa-crown",
                            class: "owner",
                            roleID: 0
                        });
                    }
                    if (roleData.vip == 1) {
                        roles.push({
                            name: "VIP",
                            className: "fa fa-star",
                            class: "vip",
                            roleID: 1
                        });
                    }
                    if (roleData.beta == 1) {
                        roles.push({
                            name: "Beta Tester",
                            className: "fa fa-flask",
                            class: "beta",
                            roleID: 2
                        });
                    }
                    if (roleData.verified == 1) {
                        roles.push({
                            name: "Verified",
                            className: "fas fa-badge-check",
                            class: "verified",
                            roleID: 3
                        });
                    }
                    var stats = {
                        level: data.level,
                        roles: roles,
                        social: socials,
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
                } else {
                    var roles = [];
                    var social = [];
                    var stats = {
                        level: data.level,
                        roles: roles,
                        social: social,
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
                    let newDBEntry = {
                        username: username,
                        platform: platform,
                        kd: data.lifetime.mode.br.properties.kdRatio.toFixed(2)
                    };
                    connection.query('INSERT INTO users SET ?', newDBEntry, (err, resp) => {
                        if(err) throw err;
                        
                        console.log('Last user insert ID:', resp.insertId);
                        res.json({error: false, data: stats});
                    });
                }
            });
            
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
