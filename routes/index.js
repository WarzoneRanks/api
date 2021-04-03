var express = require('express');
var router = express.Router();
const API = require('call-of-duty-api')();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Warzone API' });
});

router.get('/ping', async function(req, res, next) {
  var activion = true;
  /*try {
    let data = await API.MWcombatmp("DutchKingOfCali", "xbl");
    if (data != null) {
      activion = true;
    }
  } catch(Error) {
    console.log(Error);
  }*/
  res.json({ "local": true, "activision": activion})
});

module.exports = router;
