var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser =  require('body-parser');
var morgan = require('morgan');
var auth = require('http-auth');
var port = process.env.NODE_PORT | 8080;
var basic = auth.basic({
	realm: "Data Science.",
	file: ".htpasswd"
});

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', function(req,res) {
	res.send("Welcome to the Foundery Datastore API, post to /event to store your event.");
});


//database stuff
var config = {
	user: 'postgres',
	database: 'datastore',
	password: 'password',
	host: 'localhost',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 3000
};

const pool = new pg.Pool(config);

pool.connect(function (err, client) {

	if (err) throw err;

	client.query('CREATE DATABASE datastore', function (err, result) {
		if (err) {
			console.log('Database exists...');
			return;
		}
		console.log('Database created...');
		client.end(function (err) {
			if (err) throw err;
		});
	});

	client.query('CREATE TABLE events (source TEXT, event TEXT, created TIMESTAMP, data JSONB)', function (err, result) {
		if (err) {
			console.log('Table exists...');
			return;
		}
		console.log('Table created...');
		client.end(function (err) {
			if (err) throw err;
		});
	});


});


//log this into a postgres 
app.post('/event', auth.connect(basic), function (req, res) {
	var body = req.body;
	res.setHeader('Content-Type', 'application/json');
	console.log("Event received from " + body.source + " of type " + body.event + " at " + new Date() + ".");
	pool.connect(function (err, client) {
		if (err) throw err;
		client.query('INSERT INTO events (source, event, created, data) VALUES ($1, $2, $3, $4)',
			[body.source, body.event, new Date(), body.data], function (err, result) {
			if (err) throw err;
			client.end(function (err){
				if (err) throw err;
			});
		});
	});
	res.status(201).send(body).end();

});

app.listen(port, function () {
  console.log('Node server listening on port ${port}.')
});
