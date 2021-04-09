var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();
var http = require('http');
var request = require("request");
var mysql = require("mysql");
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


const API = require('call-of-duty-api')();

function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

router.get('/match/:matchID', async function(req, res, next) {
    var matchID = req.params.matchID;
    try {
        let data = await API.MWFullMatchInfowz(matchID);
        var options = {
            'method': 'GET',
            'url': `https://api.tracker.gg/api/v2/warzone/standard/matches/${matchID}`,
            'headers': {
              'Cookie': '__cfduid=d7408b042c56b054c01c919fed21e199b1617339783; X-Mapping-Server=s8; __cflb=02DiuFQAkRrzD1P1mdjW28WYn2UPf2uF9HjXpvtrRXyYG'
            }
          };
          request(options, function (error, response) {
            if (error) {
                console.log(result.error);
                res.json({error: true, msg: result.error});
                return true;
            }
            let result = JSON.parse(response.body);
            let players = null;
            if (result.data == null) {
                if (req.query.debug != null) {
                    res.json({error: true, json: result});
                } else {
                    console.log("Couldn't get players");
                    res.json({error: true, msg: "Tracker.gg API is experiencing some issues currently, please try again in a few minutes.."});
                    return;
                }
            } else {
                players = result.data.segments;
            }
            let kds = [];
            players.forEach(async function(player) {
                if (player.attributes.lifeTimeStats != null) {
                    kds.push(player.attributes.lifeTimeStats.kdRatio);
                }
            });
            var total=0;
            for(var i in kds) { total += kds[i]; }
            let averageKD_avg = (total / kds.length).toFixed(2);
            let averageKD = median(kds);

            switch(true) {
                case (averageKD > 3.57):
                    kdRank = "Legend";
                    kdClass = "legend"
                    kdPercentage = "Top 0.1%";
                    break;
                case (averageKD > 2.08):
                    kdRank = "Master";
                    kdClass = "master"
                    kdPercentage = "Top 1%";
                    break;
                case (averageKD > 1.54):
                    kdRank = "Diamond 1";
                    kdClass = "diamond"
                    kdPercentage = "Top 5%";
                    break;
                case (averageKD > 1.34):
                    kdRank = "Diamond 2";
                    kdClass = "diamond"
                    kdPercentage = "Top 10%";
                    break;
                case (averageKD > 1.23):
                    kdRank = "Diamond 3";
                    kdClass = "diamond"
                    kdPercentage = "Top 15%";
                    break;
                case (averageKD > 1.14):
                    kdRank = "Diamond 4";
                    kdClass = "diamond"
                    kdPercentage = "Top 20%";
                    break;
                case (averageKD > 1.08):
                    kdRank = "Platinum 1";
                    kdClass = "platinum"
                    kdPercentage = "Top 25%";
                    break;
                case (averageKD > 1.02):
                    kdRank = "Platinum 2";
                    kdClass = "platinum"
                    kdPercentage = "Top 30%";
                    break;
                case (averageKD > 0.97):
                    kdRank = "Platinum 3";
                    kdClass = "platinum"
                    kdPercentage = "Top 35%";
                    break;
                case (averageKD > 0.92):
                    kdRank = "Platinum 4";
                    kdClass = "platinum"
                    kdPercentage = "Top 40%";
                    break;
                case (averageKD > 0.87):
                    kdRank = "Gold 1";
                    kdClass = "gold"
                    kdPercentage = "Top 45%";
                    break;
                case (averageKD > 0.83):
                    kdRank = "Gold 2";
                    kdClass = "gold"
                    kdPercentage = "Top 50%";
                    break;
                case (averageKD > 0.78):
                    kdRank = "Gold 3";
                    kdClass = "gold"
                    kdPercentage = "Bottom 50%";
                    break;
                case (averageKD > 0.74):
                    kdRank = "Gold 4";
                    kdClass = "gold"
                    kdPercentage = "Bottom 45%";
                    break;
                case (averageKD > 0.69):
                    kdRank = "Silver 1";
                    kdClass = "silver"
                    kdPercentage = "Bottom 40%";
                    break;
                case (averageKD > 0.64):
                    kdRank = "Silver 2";
                    kdClass = "silver"
                    kdPercentage = "Bottom 35%";
                    break;
                case (averageKD > 0.59):
                    kdRank = "Silver 3";
                    kdClass = "silver"
                    kdPercentage = "Bottom 30%";
                    break;
                case (averageKD > 0.53):
                    kdRank = "Silver 4";
                    kdClass = "silver"
                    kdPercentage = "Bottom 25%";
                    break;
                case (averageKD > 0.47):
                    kdRank = "Bronze 1";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 20%";
                    break;
                case (averageKD > 0.38):
                    kdRank = "Bronze 2";
                    kdClass = "bronze"
                    kdPercentage = "Bottom 15%";
                    break;
                case (averageKD > 0.27):
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

            let newResponse = {
                allPlayers: [data.allPlayers[0]],
                ranking: {
                    averageKD: averageKD,
                    averageKD_avg: averageKD_avg,
                    rank: kdRank,
                    class: kdClass,
                    percentage: kdPercentage
                }
            };
            res.json({error: false, data: newResponse});
          });
        
    } catch(Error) {
        console.log(Error);
        res.json({error: true, msg: Error});
    }
});

router.get('/fullMatch/:matchID', async function(req, res, next) {
    var matchID = req.params.matchID;
    connection.query('SELECT * FROM matches WHERE match_id = ?', matchID, async (err,rows) => {
        if(err) throw err;
      
        console.log('Data received from Db:');
        console.log(rows);
        if (rows && rows.length) {
            let data = rows[0];
            let newResponse = {
                allPlayers: JSON.parse(data.allPlayers),
                mode: data.mode,
                startTime: data.startTime,
                ranking: {
                    averageKD: data.medianKD,
                    averageKD_avg: data.averageKD,
                    rank: data.rank,
                    class: data.class,
                    percentage: data.percentage,
                    kdChart: data.chart,
                    players: data.players
                }
            };
            res.json({error: false, data: newResponse});
        } else {
            try {
                let data = await API.MWFullMatchInfowz(matchID);
                var options = {
                    'method': 'GET',
                    'url': `https://api.tracker.gg/api/v2/warzone/standard/matches/${matchID}`,
                    'headers': {
                      'Cookie': '__cfduid=d7408b042c56e054c01c909fed21e199b1617339583; X-Mapping-Server=s8; __cflb=02DiuFQAkRrzD1P1mdjW28WYn2UPf2uF9HjXpvtrRXyYG'
                    }
                  };
                  request(options, function (error, response) {
                    if (error) {
                        console.log(result.error);
                        res.json({error: true, msg: result.error});
                        return true;
                    }
                    let result = JSON.parse(response.body);
                    let players = null;
                    if (result.data == null) {
                        if (req.query.debug != null) {
                            res.json({error: true, json: result});
                        } else {
                            console.log("Couldn't get players");
                            res.json({error: true, msg: "Tracker.gg API is experiencing some issues currently, please try again in a few minutes.."});
                            return;
                        }
                    } else {
                        players = result.data.segments;
                    }
                    let kds = [];
                    players.forEach(async function(player) {
                        if (player.attributes.lifeTimeStats != null) {
                            kds.push(player.attributes.lifeTimeStats.kdRatio);
                        }
                    });
                    var total=0;
                    for(var i in kds) { total += kds[i]; }
                    let averageKD_avg = (total / kds.length).toFixed(2);
                    let averageKD = median(kds);
        
                    switch(true) {
                        case (averageKD > 3.57):
                            kdRank = "Legend";
                            kdClass = "legend"
                            kdPercentage = "Top 0.1%";
                            kdChart = "filled-100";
                            break;
                        case (averageKD > 2.08):
                            kdRank = "Master";
                            kdClass = "master"
                            kdPercentage = "Top 1%";
                            kdChart = "filled-99";
                            break;
                        case (averageKD > 1.54):
                            kdRank = "Diamond 1";
                            kdClass = "diamond"
                            kdPercentage = "Top 5%";
                            kdChart = "filled-95";
                            break;
                        case (averageKD > 1.34):
                            kdRank = "Diamond 2";
                            kdClass = "diamond"
                            kdPercentage = "Top 10%";
                            kdChart = "filled-90";
                            break;
                        case (averageKD > 1.23):
                            kdRank = "Diamond 3";
                            kdClass = "diamond"
                            kdPercentage = "Top 15%";
                            kdChart = "filled-85";
                            break;
                        case (averageKD > 1.14):
                            kdRank = "Diamond 4";
                            kdClass = "diamond"
                            kdPercentage = "Top 20%";
                            kdChart = "filled-80";
                            break;
                        case (averageKD > 1.08):
                            kdRank = "Platinum 1";
                            kdClass = "platinum"
                            kdPercentage = "Top 25%";
                            kdChart = "filled-75";
                            break;
                        case (averageKD > 1.02):
                            kdRank = "Platinum 2";
                            kdClass = "platinum"
                            kdPercentage = "Top 30%";
                            kdChart = "filled-70";
                            break;
                        case (averageKD > 0.97):
                            kdRank = "Platinum 3";
                            kdClass = "platinum"
                            kdPercentage = "Top 35%";
                            kdChart = "filled-65";
                            break;
                        case (averageKD > 0.92):
                            kdRank = "Platinum 4";
                            kdClass = "platinum"
                            kdPercentage = "Top 40%";
                            kdChart = "filled-60";
                            break;
                        case (averageKD > 0.87):
                            kdRank = "Gold 1";
                            kdClass = "gold"
                            kdPercentage = "Top 45%";
                            kdChart = "filled-55";
                            break;
                        case (averageKD > 0.83):
                            kdRank = "Gold 2";
                            kdClass = "gold"
                            kdPercentage = "Top 50%";
                            kdChart = "filled-50";
                            break;
                        case (averageKD > 0.78):
                            kdRank = "Gold 3";
                            kdClass = "gold"
                            kdPercentage = "Bottom 50%";
                            kdChart = "filled-50";
                            break;
                        case (averageKD > 0.74):
                            kdRank = "Gold 4";
                            kdClass = "gold"
                            kdPercentage = "Bottom 45%";
                            kdChart = "filled-45";
                            break;
                        case (averageKD > 0.69):
                            kdRank = "Silver 1";
                            kdClass = "silver"
                            kdPercentage = "Bottom 40%";
                            kdChart = "filled-40";
                            break;
                        case (averageKD > 0.64):
                            kdRank = "Silver 2";
                            kdClass = "silver"
                            kdPercentage = "Bottom 35%";
                            kdChart = "filled-35";
                            break;
                        case (averageKD > 0.59):
                            kdRank = "Silver 3";
                            kdClass = "silver"
                            kdPercentage = "Bottom 30%";
                            kdChart = "filled-30";
                            break;
                        case (averageKD > 0.53):
                            kdRank = "Silver 4";
                            kdClass = "silver"
                            kdPercentage = "Bottom 25%";
                            kdChart = "filled-25";
                            break;
                        case (averageKD > 0.47):
                            kdRank = "Bronze 1";
                            kdClass = "bronze"
                            kdPercentage = "Bottom 20%";
                            kdChart = "filled-20";
                            break;
                        case (averageKD > 0.38):
                            kdRank = "Bronze 2";
                            kdClass = "bronze"
                            kdPercentage = "Bottom 15%";
                            kdChart = "filled-15";
                            break;
                        case (averageKD > 0.27):
                            kdRank = "Bronze 3";
                            kdClass = "bronze"
                            kdPercentage = "Bottom 10%";
                            kdChart = "filled-10";
                            break;
                        default: 
                            kdRank = "Bronze 4";
                            kdClass = "bronze"
                            kdPercentage = "Bottom 5%";
                            kdChart = "filled-5";
                            break;
                        
                    }

                    let newPlayers = [];

                    players.forEach(function(p) {
                        if (p.attributes.lifeTimeStats != null) {
                            let newPlayer = {
                                attributes: {
                                    lifeTimeStats: {
                                        kdRatio: p.attributes.lifeTimeStats.kdRatio
                                    }
                                },
                                metadata: {
                                    placement: {
                                        value: p.metadata.placement.value
                                    },
                                    platformUserHandle: p.metadata.platformUserHandle
                                },
                                stats: {
                                    headshots: {
                                        value: p.stats.headshots.value
                                    },
                                    kills: {
                                        value: p.stats.kills.value
                                    },
                                    damageDone: {
                                        value: p.stats.damageDone.value
                                    },
                                    kdRatio: {
                                        displayValue: p.stats.kdRatio.displayValue
                                    },
                                    deaths: {
                                        value: p.stats.deaths.value
                                    }
                                }
                            };
                            newPlayers.push(newPlayer);
                        } else {
                            let newPlayer = {
                                metadata: {
                                    placement: {
                                        value: p.metadata.placement.value
                                    },
                                    platformUserHandle: p.metadata.platformUserHandle
                                },
                                attributes: {},
                                stats: {
                                    headshots: {
                                        value: p.stats.headshots.value
                                    },
                                    kills: {
                                        value: p.stats.kills.value
                                    },
                                    damageDone: {
                                        value: p.stats.damageDone.value
                                    },
                                    kdRatio: {
                                        displayValue: p.stats.kdRatio.displayValue
                                    },
                                    deaths: {
                                        value: p.stats.deaths.value
                                    }
                                }
                            };
                            newPlayers.push(newPlayer);
                        }
                    });
        
                    let newResponse = {
                        allPlayers: newPlayers,
                        mode: result.data.attributes.modeId,
                        startTime: result.data.metadata.timestamp,
                        ranking: {
                            averageKD: averageKD,
                            averageKD_avg: averageKD_avg,
                            rank: kdRank,
                            class: kdClass,
                            percentage: kdPercentage,
                            kdChart: kdChart,
                            players: kds.length
                            
                        }
                    };
                    let newDBEntry = {
                        match_id: matchID,
                        mode: result.data.attributes.modeId,
                        startTime: result.data.metadata.timestamp,
                        allPlayers: JSON.stringify(newPlayers),
                        averageKD: averageKD_avg,
                        medianKD: averageKD,
                        rank: kdRank,
                        class: kdClass,
                        percentage: kdPercentage,
                        chart: kdChart,
                        players: kds.length
                    };
                    connection.query('INSERT INTO matches SET ?', newDBEntry, (err, resp) => {
                        if(err) throw err;
                        
                        console.log('Last insert ID:', resp.insertId);
                        res.json({error: false, data: newResponse});
                    });
                  });
                
            } catch(Error) {
                console.log(Error);
                res.json({error: true, msg: Error});
            }
        }
    });
    
});


module.exports = router;
