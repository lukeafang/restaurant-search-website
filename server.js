const path = require('path');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
require("babel-polyfill");

process.env.PORT = 8080;
const port = process.env.PORT;

// set thpe view engine to ejs
app.set('view engine', 'ejs');

var root = '/';
// Set static folder.
app.use(root, express.static(path.join(__dirname, '/views')));

// Body parser middleware.
app.use(bodyParser.json());			// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// app.set('trust proxy', true);

const db = require('./database.js');
db.init(function (msg) {
    console.log(msg);
});

//DashBoard
app.get('/', (req, res) => {
    var name = "Riviera Caterer";
    var cuisine = "Hamburgers"
    var restaurant_id = '30112340';
    var building = '1007 ';
    var street = 'Morris Park Ave';
    var zipcode = '10462';
    res.render('index.ejs');
});

app.post('/', (req, res) => {
    if (req.body.search) {
        if (req.body.seachByName) {
            var name = req.body.name;
            db.getRestaurantListByName(name, function (result) {
                res.send(result);
            });
        } else if (req.body.seachByBorough) {
            var borough = req.body.borough;
            db.getRestaurantListByBorough(borough, function (result) {
                res.send(result);
            });
        } else if (req.body.seachByCuisine) {
            var cuisine = req.body.cuisine;
            db.getRestaurantListByCuisine(cuisine, function (result) {
                res.send(result);
            });
        } else if (req.body.seachByAddress) {
            var building = req.body.building;
            var street = req.body.street;
            var zipcode = req.body.zipcode;
            db.getRestaurantListByAddress(building, street, zipcode, function (result) {
                res.send(result);
            });
        } else if (req.body.seachByGrade) {
            var grade = req.body.grade;
            db.getRestaurantListByGrade(grade, function (result) {
                res.send(result);
            });
        } else if (req.body.seachByID) {
            var id = req.body.id;
            db.getRestaurantByID(id, function (result) {
                res.send(result);
            });
        }
        else {
        }

    } else if (req.body.add) {
        var restaruantID = req.body.restaruantID;
        var name = req.body.name;
        var borough = req.body.borough;
        var cuisine = req.body.cuisine;
        var address = {
            building: req.body.building,
            street: req.body.street,
            zipcode: req.body.zipcode
        }
        var gradeObj = {
            date: new Date(),
            grade: req.body.grade,
            score: req.body.score
        }

        // check id not exist, if exist then return false
         db.getRestaurantByID(restaruantID, function (docs) {
            if (docs.length == 0) {
                db.addNewRestaurant(restaruantID, name, borough, cuisine, address, gradeObj, function(result){
                    res.send(result);
                });
            } else {
                //exist restaurant_id could not add new one
                var obj = {};
                obj['msg'] = 'error';
                obj['errorMsg'] = 'Error, restaurant has already exist.'
                res.send(obj);           
            }
        });       
    } else if (req.body.update) {
        var restaruantID = req.body.restaruantID;
        var name = req.body.name;
        var borough = req.body.borough;
        var cuisine = req.body.cuisine;
        var address = {
            building: req.body.building,
            street: req.body.street,
            zipcode: req.body.zipcode
        }

        // check id exist before update
        db.getRestaurantByID(restaruantID, function (docs) {
            if (docs.length == 0) {
                // not exist restaurant_id
                var obj = {};
                obj['msg'] = 'error';
                obj['errorMsg'] = 'Error, id not exist.'
                res.send(obj);
            } else {
                db.updateRestaurant(restaruantID, name, borough, cuisine, address, function (result) {
                    res.send(result);
                }); 
            }
        });
    } else if (req.body.delete) {
        var id = req.body.restaruantID;
        db.getRestaurantByID(id, function (docs) {
            if (docs.length == 0) {
                // not exist restaurant_id
                res.send('Restaurant ID not exist.');
            } else {
                db.deleteRestaurant(id, function (result) {
                    res.send('deleted');
                });
            }
        });
    } else if (req.body.checkRestaurantExist) {
        var id = req.body.restaruantID;
        db.getRestaurantByID(id, function (docs) {
            var obj = {};
            if (docs.length == 0) {
                // not exist restaurant_id
                obj['msg'] = 'not exist';
                res.send(obj);
            } else {
                obj['doc'] = docs[0];
                obj['msg'] = 'exist';
                res.send(obj);
            }
        });       
    } else if( req.body.addGrade ) {
        var restaruantID = req.body.restaruantID;
        var gradeObj = {
            date: new Date(),
            grade: req.body.grade,
            score: req.body.score
        }

        // check id exist before update
        db.getRestaurantByID(restaruantID, function (docs) {
            if (docs.length == 0) {
                // not exist restaurant_id
                var obj = {};
                obj['msg'] = 'error';
                obj['errorMsg'] = 'Error, id not exist.'
                res.send(obj);
            } else {
                db.addNewRestaurantGrade(restaruantID, gradeObj, function(result){
                    res.send(result);
                });
            }
        });        
    }
});

app.get('/contact', (req, res) => {
    var data = 1;
    res.render('contact.ejs', { data: data });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});