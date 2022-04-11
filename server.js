//creating the database for the API
const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

//adding express to the program
var express = require("express");
var app = express();

//adding body-parser to parse json into the API
var bodyParser = require("body-parser");
app.use(bodyParser.json());

//creates landing page for the web API
app.get("/", (req, res, next) => {
	res.send('Welcome to our main route')
});

//inserting items into the API
app.post("/add-phone", function(req, res){
	db.run(`INSERT INTO phones (brand, model, os, image, screensize)
	VALUES (?, ?, ?, ?, ?)`, [req.body.brand, req.body.model, req.body.os, req.body.image,  req.body.screensize], function(err) {
		if (err){
			res.status(400).send('Bad request. Please check API documentation.');
		}
		else{
			console.log("inserted into phones database.");
			res.status(201).send('Phone has been successfully added to the database.');
		}
	});
});

//get all items from the database
app.get('/phones', (req, res, next) => {
	db.all('SELECT * FROM phones', function (err, row) {
		if(err){
			res.status(500).send('We have experienced an Internal Server Issue.');
		}
		return res.send(row)
	});
});

//get item by id
app.get('/phones/:id', function(req, res) {
	console.log(req.params.id);
	db.all("SELECT id, brand, model, os, image, screensize FROM phones WHERE id=" + req.params.id, function(err,row)
  	{
		if (err) {
			res.status(500).send('We have experienced an Internal Server Issue.');
		}
		else {
        	return res.send(row)
		}
	});
});

//delete all items in database
app.delete('/remove-phone', (req, res) => {
	db.run('DELETE FROM phones', function (err){
		if (err){
			res.status(400).send('Bad request. Please check API documentation.');
		}
		else {
			console.log("deleted data");
		}
		res.sendStatus(200);
	});
});

//delete by id
app.delete('/remove-phone/:id', (req, res) => {
	db.run('DELETE FROM phones WHERE id=' + req.params.id, function (err){
		if (err){
			res.status(404).send('Item ID cannot be found.');
		}
		else{
			console.log("deleted specific data");
			res.sendStatus(200);
		}

	});
});


//updates items in database
app.put("/update/:id", function (req, res){
	db.run(`UPDATE phones SET brand=?, model=?, os=?, image=?, screensize=? WHERE id=` + req.params.id,
	[req.body.brand, req.body.model, req.body.os, req.body.image,  req.body.screensize], function(err) {
		if (err){
			res.status(400).send('Bad request. Please check API documentation.');
		}
		else{
			console.log("updated phones database.");
			res.sendStatus(200);
		}
	});
});


//derived from https://levelup.gitconnected.com/how-to-handle-errors-in-an-express-and-node-js-app-cb4fe2907ed9
app.use((req, res, next) => {
	res.status(404).send({
	error: 'Path cannot be found'
	});
});

app.listen(3000);

// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
			)`);

		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}
