var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/step", function(req, res, next){
	res.send();
});

router.post("/step", function(req, res, next){
	res.send();
});

module.exports = router;
