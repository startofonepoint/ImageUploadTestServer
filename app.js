var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        console.log('multer storage filename function');
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now());
    }   
    });
var upload =  multer({storage:_storage});

var app = express();

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.raw()); // for parsing raw

var connection = mysql.createConnection({
	host : '127.0.0.1',
	port : '3306',
	user : 'lostin',
	password : '13do1172',
	database : 'test'
});

connection.connect(function(err) {
	if (err) {
		console.error('mysql connection error');
		console.error(err);
		throw err;
	}
});

app.get('/', function(req, res) {
	fs.readFile('index.html', function(err, data) {
		if (err) {
			console.error('index.html load error');
			console.error(err);
			throw err;
		}
		else {
			res.writeHead(200, {'Content-Type':'text/html'});
            console.log(data);
			res.end(data);
		}
	});
});

app.route('/users')
app.get('/users',function (req, res) {
    console.log('get method display request body object');
	console.log(req.body);
	var query = connection.query('select userid, username, email from tbuser', function(err, rows) {
		if (err) {
			console.error('mysql query error');
			console.error(err);
			throw err;
		}
		console.log(rows);
		res.json(rows);
  	});
 	console.log(query);
});
app.post('/users',function (req, res) {
	console.log('post method display request body object');
	console.log(req.body);
	var query = connection.query('select userid, username, email from tbuser where userid = ' + mysql.escape(req.body.userid),function(err, rows) {
	   if (err) {
	       console.error('mysql query error');
	       console.error(err);
	       throw err;
	   }
	   console.log(rows);
	   res.json(rows);
    });
    console.log(query);
});

app.post('/upload', upload.single('userPhoto'), function (req, res) {  
    console.log('Uploaded :' + req.file);
    res.send('upload success!');
}); 
/*
app.post('/upload', function(req,res) {
   console.log(req);
   res.send(req); 
});
*/
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});