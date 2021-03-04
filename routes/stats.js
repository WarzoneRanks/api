var express = require('express');
var router = express.Router();
const API = require('call-of-duty-api')();

/* GET player stats. */
router.get('/:platform/:username', async function(req, res, next) {
    var platform = req.params.platform;
    var username = req.params.username;
    try {
        let data = await API.MWwz(username, platform);
        res.json({error: false, data: data});
    } catch(Error) {
        console.log(Error);
        res.json({error: true, msg: Error});
    }
});


module.exports = router;
