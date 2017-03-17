var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session')

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(session({secret: 'parkr_secret', resave: false, saveUninitialized: true}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sess; 


//checks to see if database is connected
mysql.connection.connect(function(err){
if(!err) {
    console.log("Database is connected ...");    
} else {
    console.log("Error connecting database ...");    
}
});


app.get('/create_account', function(req,res,next){
  res.render('create_account');
});


app.get('/log_in', function(req,res,next){
  res.render('log_in');
});


//redirects user back to log in page if not logged in yet
app.all('*',function(req,res,next) {
    if ((req.path == '/log_in_check') | (req.path == '/create_account') | (req.path == '/create_account_check')) return next();
    
    
    if (!req.session.email){
        // if user is not logged-in redirect back to login page 
        console.log("redirecting");
        res.redirect('/log_in');
    }   
    else{
        next();
    }
});

//renders the home page
app.get('/', function(req,res,next){
  res.render('index');
});


//renders page that adds parking spot to spots the user is renting out
app.get('/add_parking', function(req,res){
  res.render('add_parking');
});


//adds a parking spot to to spots the user is renting out
app.post('/insert', function(req, res, next){
  if(req.body)
  {
    
    //context.results = {};
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var availability = req.body.availability;   
    var price = req.body.price;
    //var photo = req.body.photo;                 //Value received from client was 'undefined'
    var photo = "Test2.png";
    var fk =  sess.user_id;

    mysql.connection.query("INSERT INTO c9.parking (`address`,`city`,`state`,`zip`,`availability`,`price`,`photo`, `fk_owner_id`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);", [address, city, state, zip, availability, price, photo, fk], function(err, result){
      if (err){
        next(err);
        return;
      }
    });
    
    console.log("req.body: " + req.body);
    res.send("form submission success!  I am sending: " + address + ", " + city + ", " + state + ", " + zip + ", " + availability + ", " + price + ", " + photo + ", " + fk);
  }
  else
  {
    //error, do something else
    res.send("Can't find variables!");
  }
});


//returns all spots available for renting
app.get('/getAllSpots',function(req,res,next){

    mysql.connection.query("SELECT * FROM c9.parking", function(err, rows, fields){  
        if(err){
            next(err);
            console.log("select query failed");
        }
        else{
            res.type('text/plain');
            res.send(rows);
        }
    } );
});


//returns spots that the current user is making avaible for renting
app.get('/getSubmittedSpots',function(req,res,next){

   var fk = req.session.user_id;  

    mysql.connection.query("SELECT * FROM c9.parking p WHERE p.fk_owner_id=?", [fk], function(err, rows, fields){
        if(err){
            next(err);
            console.log("select query failed");
        }
        else{
            res.type('text/plain');
            res.send(rows);
        }
    } );
});


//renders page that allows a user to search for parking
app.get('/search_parking', function(req, res, next){ 
  res.render('search_parking');
});


//updates availability to the opposite boolean value of what the value currently is
app.post('/update_avail', function(req, res, next){
  var context = {};
  var id = req.body.parking_id;
  var availability = req.body.availability;
  var val;
  var notVal;
  
  mysql.connection.query("SELECT * FROM c9.parking WHERE parking_id=?", [id], function(err, result){
    if(err){
      next(err);
      return;
    }
    
    if(result.length == 1){
      var currentVals = result[0];
      
      val = result[0].availability;

      if(val == 1)
      {
        notVal = 0;
      }
      else
      {
        notVal = 1;
      }
      
      mysql.connection.query("UPDATE c9.parking SET availability = NOT availability WHERE parking_id=?",  [id],
      function(err, result){
        if(err){
          next(err);
          return;
        }
        
        context.results = "Updated " + result.changedRows + " rows.  Availability changed from " + val + " to: " + notVal;
        
        console.log(context.results);  //output context.results to server console
        res.send(context.results);  //send context.results to client
      });  //end inner mysql.connection.query
    } //end if
    else
    {
      res.send("Parking_id not found!");  //send message to client
    }
    
  }); //end outer mysql.connection.query
}); // end app.get


//search for parking spots with requested zip, city or state values in the "parking" table -- this implementation has now been tested
//checks to see if a valid user (user that exists in the "user" table, default is "1") submitted form data and looks for either, zip, city or state
app.post('/search', function(req, res, next) {
  var context = {};
  var search_query = "";
  
  if (req.body.zip) {
    search_query+="SELECT * FROM c9.parking WHERE zip=" + req.body.zip;
  }
  else if (req.body.city) {
    search_query+="SELECT * FROM c9.parking WHERE city='" + req.body.city + "'";
  }
  else if (req.body.state) {
    search_query+="SELECT * FROM c9.parking WHERE state='" + req.body.state +"'";
  }
  
  console.log("search_query is: " + search_query);
  
  if(req.body.zip || req.body.city || req.body.state) {
    //mysql.connection.query(search_query, function(err, result){
    mysql.connection.query(search_query, function(err, rows, fields){
        if (err) {
          next(err);
          return;
        }
        
        context.results = (rows);
        console.log(context.results);
      
        res.send(context.results);
    });//end mysql.connection.query()
  }//end inner if
  else {
    console.log("Client did not submit either 'zip', 'city' or 'state' values.");
    context.results = "Client did not submit either 'zip', 'city' or 'state' values.";
    res.send(context.results);  
  }//end else
  
});


//checks to see if supplied email and password are in same entry in the "user" table.  If yes, server passes "/?user_id={user_id}" back to client.  If no, sends client "invalid" redirect
app.post('/log_in_check', function(req, res, next) {
  sess = req.session;
  var context = {};

  mysql.connection.query("SELECT * FROM c9.user WHERE email=? AND password=?", [req.body.email, req.body.password], function(err, user_check){
    if(err){
      next(err);
      return;
    }
    
    if(user_check.length == 1){
      context.results = user_check[0];
      
      console.log("User found in database!  User_id is: " + context.results.user_id);
      sess.user_id = context.results.user_id;
      sess.email = context.results.email;
      
      res.send({redirect: '/?user_id=' + context.results.user_id});
    }//end id_check if
    else {
      //error 
      res.send({redirect: 'invalid'});
    }//end else
  }); //end outer mysql.connection.query
});


//checks to see if supplied email is in use, then if supplied user_id is in use.  If no to both, server passes "/?user_id={user_id}" back to client.  If yes to either, sends client "invalid" redirect
app.post('/create_account_check', function(req, res, next) {
  var context = {};

  mysql.connection.query("SELECT * FROM c9.user WHERE email=?", [req.body.email], function(err, account_check){
    if(err){
      next(err);
      return;
    }
    
    if(account_check.length == 1){
      //email already in use (ie. account already exists)
      console.log("Email already in use!  Email: " + account_check.email);
      res.send({redirect: 'invalid'});
    }//end id_check if

    mysql.connection.query("SELECT * FROM c9.user WHERE user_id=?", [req.body.user_id], function(err, id_check){
    if(err){
      next(err);
      return;
    }
    
        if(id_check.length == 1){
          //user_id already in use (ie. account already exists)
          console.log("User_id already in use!  User_id: " + id_check.user_id);
          res.send({redirect: 'invalid'});
        }//end id_check if
    
        else {
          var first_name = req.body.first_name;
          var last_name = req.body.last_name;
          var user_id = req.body.user_id;
          var email = req.body.email;
          var password = req.body.password;
          
          mysql.connection.query("INSERT INTO c9.user (`user_id`,`first_name`,`last_name`,`password`,`email`) VALUES ( ?, ?, ?, ?, ?);", [user_id, first_name, last_name, password, email], function(err, result){
            if (err){
              next(err);
              return;
            }
            
            context.results = "Updated " + result.changedRows;
            console.log(context.results);
            
          });//end insert mysql.connection.query
          
          res.send({redirect: '/?user_id=' + req.body.user_id});
        }//end else
    });//end inner mysql.connection.query
  }); //end outer mysql.connection.query
});


//renders a page that allows a user to add their car to the database
app.get('/add_car', function(req,res){
  res.render('add_car');
});


//adds a user's car to the database
app.post('/add', function(req, res, next){
  
  if(req.body)
  {
    //context.results = {};
    var make = req.body.make;
    var model = req.body.model;
    var year = req.body.year;
    var license = req.body.license;
    var photo = "Test2.png";
    var userid = sess.user_id;
    
    mysql.connection.query("INSERT INTO c9.car (`user_id`,`make`,`model`,`year`,`license_plate`,`photo`) VALUES ( ?, ?, ?, ?, ?, ?);", [userid, make, model, year, license, photo], function(err, result){
      if (err){
        next(err);
        return;
      }
    });
    
    console.log("req.body: " + req.body);
    res.send("form submission success!  I am sending: " + userid + ", " + make + ", " + model + ", " + year + ", " + license + ", " + photo );
  }
  
  else
  {
    //error, do something else
    res.send("Can't find variables!");
  }
  
});


app.get('/selection_page', function(req,res){
  res.render('selection_page');
});


//logs a user out and brings them back to the log in page
app.get('/logout',function(req, res) {
  req.session.destroy();
  res.redirect('/log_in');
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