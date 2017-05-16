var express = require('express');
var pg = require('pg');
var app = express()
var bodyParser =  require('body-parser');
var port = process.env.NODE_PORT | 8080;

//auth key
var key = "aa84e0cc54ceb040f7f6bc364d6a7782";

app.use(bodyParser.json());

app.get('/', function(req,res) {
	res.send("Welcome to the Foundery datastore api, post to /event to store your event");
});


//database stuff
var config = {
	user: 'postgres',
	database: 'datastore',
	password: 'postgres',
	host: 'localhost',
	port: 5433,
	max: 10,
	idleTimeoutMillis: 3000
}

const pool = new pg.Pool(config);

pool.connect(function (err, client) {

	if (err) throw err;

	client.query('CREATE DATABASE datastore', function (err, result) {
		if (err) {
			console.log('db exists');
			return;
		}
		console.log('database created');
		client.end(function (err) {
			if (err) throw err;
		});
	});

	client.query('CREATE TABLE events (source TEXT, event TEXT, created TIMESTAMP, data JSONB)',
		function (err, result) {
			if (err) {
				console.log('table exist');
				return;
			}
			console.log('table created');
			client.end(function (err) {
			if (err) throw err;
		});
	});


});


//log this into a postgres 
app.post('/event', function (req, res) {
	var body = req.body;
	if (req.headers.authentication !== key) {
		res.status(401).end();
	}
	pool.connect(function (err, client) {
		if (err) throw err;
		client.query('INSERT INTO events (source, event, created, data) VALUES ($1, $2, $3, $4)',
			[body.source, body.evnt, new Date(), body.data], function (err, result) {
			if (err) throw err;
			client.end(function (err){
				if (err) throw err;
			});
		});
	});
	res.status(201).send(body).end();

});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
