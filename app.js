var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');



app.get('/', function(req,res){
  res.render('index');
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("App listening on port 3000!");
});