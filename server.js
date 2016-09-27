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

var Schema = mongoose.Schema;

var FavoritePokemonSchema = new Schema({
      name: String,
      updated_at: { type: Date, default: Date.now},
});

var FavoritePokemon = mongoose.model('FavoritePokemon', FavoritePokemonSchema);

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

app.get('/total', function(req, res){

    FavoritePokemon.find(function (err, favoritepokemons) {
      if (err) return console.error(err);
      //console.log(favoritepokemons);
      res.send(favoritepokemons);
    });
})

app.get('/:pokemon', function(req, res){
    res.render('pokedex');
})

app.post('/pokemon', function(req, res){

    //console.log(req.body.pokemon);
    var counter = 0;
    var counter2 = 0;
    var pokemon = req.body.pokemon;
    var address = 'https://www.pokemon.com/us/pokedex/'+pokemon;

    request(address, function(error, response, html){
        var $ = cheerio.load(html);
        var result = {};

        //Picture Link
        var link = $('img.active').attr('src');
        result.link = link;

        //Text
        $('p').each(function(i, element){
            if(counter == 0){
                var text = $(this).text().trim();
                counter++;
                result.text = text;
                //console.log(text);
            }
            else{
                return;
            }
        })

        //ID Number
        var id = $('#pokemonID').text().trim();
        result.id = id;
        //console.log(id);

        //Other Values
        $('.attribute-value').each(function(i, element){
            if(counter2 == 2){
                counter2++;
            }
            else if(counter2 == 0){
                var height = $(this).text().trim();
                //console.log(height);
                result.height = height;
                counter2++;
            }
            else if(counter2 == 1){
                var weight = $(this).text().trim();
                //console.log(weight);
                result.weight = weight;
                counter2++;
            }
            else if(counter2 == 3){
                var category = $(this).text().trim();
                //console.log(category);
                result.category = category;
                counter2++;
            }
            else{
                var ability = $(this).text().trim();
                //console.log(ability);
                result.ability = ability;
                counter2++;
            }
            
        })
         console.log(result);
         res.json(result);
    })
   
})

app.post('/favorite', function(req, res){
    var pokemon = req.body.pokemon;

    var newPokemon = new FavoritePokemon({name: pokemon});

    newPokemon.save(function (err, result){
        if(err){
            console.log(err);
            res.send('Sorry there was an error!');
        }
        else{
            res.send('Pokemon saved successfully!');
        }
    })

})


app.listen(port);