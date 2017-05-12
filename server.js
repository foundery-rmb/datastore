var express = require('express')
var app = express()
var bodyParser =  require('body-parser');

var port = process.env.NODE_PORT | 8080;

app.use(bodyParser.json());

app.get('/', function(req,res) {
	res.send("Welcome to the Foundery datastore api, post to /event to store your event");
});


//log this into a postgres 
app.post('/event', function (req, res) {
  var event = req.body;
  console.log(req.body);
  res.setHeader('Content-Type', 'application/json')
  res.status(201).send(req.body).end();
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})

