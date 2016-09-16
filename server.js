const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require('request');

//Mongoose stuff
mongoose.connect('mongodb://heroku_sl5t668c:d4gmc54o0iiei8jfqc27e2gife@ds033066.mlab.com:33066/heroku_sl5t668c');
const db = mongoose.connection;

db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function () {
  console.log('Mongoose connection successful.');
});

//Public
app.use(express.static('public'));

//Body Parser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    res.render('index');
})

app.get('/:pokemon', function(req, res){
    res.render('pokedex');
})

app.listen(port);