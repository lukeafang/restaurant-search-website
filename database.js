var MongoClient = require('mongodb').MongoClient;
const nconf = require('nconf');
var test = require('assert');

// Read in keys and secrets. Using nconf use can set secrets via
// environment variables, command-line arguments, or a keys.json file.
nconf.argv().env().file('keys.json');
// nconf.argv().env().file('keys_sample.json');

// Connect to a MongoDB server provisioned over at
// MongoLab.  See the README for more info.
const db_user = nconf.get('mongoUser');
const db_pass = nconf.get('mongoPass');
const db_host = nconf.get('mongoHost');

let uri = `mongodb://${db_user}:${db_pass}@${db_host}`;
if (nconf.get('mongoDatabase')) {
    uri = `${uri}/${nconf.get('mongoDatabase')}`;
}

exports.init = function (cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        // cb('Database connection sucessful');

        collection.findOne({ restaurant_id: "30112340" }, function (err, doc) {
            if (err) {
                console.log('Find one error.');
                throw err;
            }

            if( doc != null ) {
                // console.log(doc.name);
                client.close();
                cb('Database connection sucessful');
            } else {
                cb('Database connection sucessful, data not found.'); 
            }
        });
    });
};

exports.getRestaurantByID = function (restaurant_id, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        // Perform a simple find and return all the documents
        collection.find({ restaurant_id }).toArray().then(function (docs) {
            client.close();
            // add index in the docs
            for(var i=0;i<docs.length;i++) {
                var doc = docs[i];
                doc['index'] = i+1;
                var grade_Summary = ''
                var count = 1;
                for(var j=0;j<doc.grades.length;j++) {
                    var temp = doc.grades[j];
                    var time = new Date(temp.date).toISOString().split('T')[0];
                    var str = `(#${count}): ${time}, Grade:${temp.grade}, Score:${temp.score}\n`;
                    grade_Summary += str;
                    count = count + 1;
                    if( count >= 4 ) { break; }
                }
                doc['grade_Summary'] = grade_Summary;
            }            
            cb(docs);
        });
    });
};

exports.getRestaurantListByName = function (name, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        collection.find({ name: {$regex: ".*" + name + ".*" } }).toArray().then(function (docs) {
            client.close();
            // add index in the docs
            for(var i=0;i<docs.length;i++) {
                var doc = docs[i];
                doc['index'] = i+1;

                var grade_Summary = ''
                var count = 1;
                for(var j=0;j<doc.grades.length;j++) {
                    var temp = doc.grades[j];
                    var time = new Date(temp.date).toISOString().split('T')[0];
                    var str = `(#${count}): ${time}, Grade:${temp.grade}, Score:${temp.score}\n`;
                    grade_Summary += str;
                    count = count + 1;
                    if( count >= 4 ) { break; }
                }
                doc['grade_Summary'] = grade_Summary;
            }            
            cb(docs);
        });
    });
};

exports.getRestaurantListByCuisine = function (cuisine, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        collection.find({ cuisine: {$regex: ".*" + cuisine + ".*" } }).toArray().then(function (docs) {
            client.close();
            // add index in the docs
            for(var i=0;i<docs.length;i++) {
                var doc = docs[i];
                doc['index'] = i+1;
                var grade_Summary = ''
                var count = 1;
                for(var j=0;j<doc.grades.length;j++) {
                    var temp = doc.grades[j];
                    var time = new Date(temp.date).toISOString().split('T')[0];
                    var str = `(#${count}): ${time}, Grade:${temp.grade}, Score:${temp.score}\n`;
                    grade_Summary += str;
                    count = count + 1;
                    if( count >= 4 ) { break; }
                }
                doc['grade_Summary'] = grade_Summary;
            }            
            cb(docs);
        });
    });
};

exports.getRestaurantListByBorough = function (borough, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        collection.find({ borough: {$regex: ".*" + borough + ".*" } }).toArray().then(function (docs) {
            client.close();
            // add index in the docs
            for(var i=0;i<docs.length;i++) {
                var doc = docs[i];
                doc['index'] = i+1;
                var grade_Summary = ''
                var count = 1;
                for(var j=0;j<doc.grades.length;j++) {
                    var temp = doc.grades[j];
                    var time = new Date(temp.date).toISOString().split('T')[0];
                    var str = `(#${count}): ${time}, Grade:${temp.grade}, Score:${temp.score}\n`;
                    grade_Summary += str;
                    count = count + 1;
                    if( count >= 4 ) { break; }
                }
                doc['grade_Summary'] = grade_Summary;
            }
            cb(docs);
        });
    });
};

exports.getRestaurantListByAddress = function (building, street, zipcode, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        var addressObj = {};
        if (building.length > 0) { addressObj["address.building"] = building; }
        if (street.length > 0) { addressObj["address.street"] = street; }
        if (zipcode.length > 0) { addressObj["address.zipcode"] = zipcode; }
        // console.log(addressObj);

        collection.find(addressObj).toArray().then(function (docs) {
            client.close();
            // add index in the docs
            for(var i=0;i<docs.length;i++) {
                var doc = docs[i];
                doc['index'] = i+1;
                var grade_Summary = ''
                var count = 1;
                for(var j=0;j<doc.grades.length;j++) {
                    var temp = doc.grades[j];
                    var time = new Date(temp.date).toISOString().split('T')[0];
                    var str = `(#${count}): ${time}, Grade:${temp.grade}, Score:${temp.score}\n`;
                    grade_Summary += str;
                    count = count + 1;
                    if( count >= 4 ) { break; }
                }
                doc['grade_Summary'] = grade_Summary;
            }             
            cb(docs);
        });

    });
};

exports.getRestaurantListByGrade = function (grade, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        // db.inventory.find( { "instock": { warehouse: "A", qty: 5 } } )
        collection.find(
            {
                "grades.grade": grade
            }
        ).toArray().then(function (docs) {
            client.close();
            // add index in the docs
            for(var i=0;i<docs.length;i++) {
                var doc = docs[i];
                doc['index'] = i+1;
                var grade_Summary = ''
                var count = 1;
                for(var j=0;j<doc.grades.length;j++) {
                    var temp = doc.grades[j];
                    var time = new Date(temp.date).toISOString().split('T')[0];
                    var str = `(#${count}): ${time}, Grade:${temp.grade}, Score:${temp.score}\n`;
                    grade_Summary += str;
                    count = count + 1;
                    if( count >= 4 ) { break; }
                }
                doc['grade_Summary'] = grade_Summary;
            }            
            cb(docs);
        });

    });
};

exports.getRestaurantListByScore = function (score, isGreater, cd) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        if (isGreater) {
            collection.find(
                {
                    "grades.score": { "$gt": score }
                }
            ).toArray().then(function (docs) {
                client.close();
                // add index in the docs
                for(var i=0;i<docs.length;i++) {
                    var doc = docs[i];
                    doc['index'] = i+1;
                    var grade_Summary = ''
                    var count = 1;
                    for(var j=0;j<doc.grades.length;j++) {
                        var temp = doc.grades[j];
                        var time = new Date(temp.date).toISOString().split('T')[0];
                        var str = `(#${count}): ${time}, Grade:${temp.grade}, Score:${temp.score}\n`;
                        grade_Summary += str;
                        count = count + 1;
                        if( count >= 4 ) { break; }
                    }
                    doc['grade_Summary'] = grade_Summary;
                }                 
                cb(docs);
            });
        } else {
            collection.find(
                {
                    "grades.score": score
                }
            ).toArray().then(function (docs) {
                client.close();
                // add index in the docs
                for(var i=0;i<docs.length;i++) {
                    var doc = docs[i];
                    doc['index'] = i+1;
                    var grade_Summary = ''
                    var count = 1;
                    for(var j=0;j<doc.grades.length;j++) {
                        var temp = doc.grades[j];
                        var time = new Date(temp.date).toISOString().split('T')[0];
                        var str = `(#${count}): ${time}, Grade:${temp.grade}, Score:${temp.score}\n`;
                        grade_Summary += str;
                        count = count + 1;
                        if( count >= 4 ) { break; }
                    }
                    doc['grade_Summary'] = grade_Summary;
                } 
                cb(docs);
            });
        }
    });
}

// add new restaurant
exports.addNewRestaurant = function (restaurant_id, name, borough, cuisine, address, gradeObj, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        var rest_object = {};
        rest_object['restaurant_id'] = restaurant_id;
        rest_object['name'] = name;
        rest_object['borough'] = borough;
        rest_object['cuisine'] = cuisine;
        rest_object['address'] = address;
        rest_object['grades'] = [];
        if (gradeObj != null) {
            rest_object['grades'].push(gradeObj);
        }

        collection.insertOne(rest_object).then(function (r) {
            test.equal(1, r.insertedCount);
            client.close();
            cb("inserted");
        });
    });
}

//update
exports.updateRestaurant = function (restaurant_id, name, borough, cuisine, address, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        collection.findOneAndUpdate(
            { restaurant_id: restaurant_id }
            , {
                $set: {
                    name: name,
                    borough: borough,
                    cuisine: cuisine,
                    address: address,
                }
            }
            , {
                returnOriginal: false,
                upsert: false
            }
        ).then(function (r) {
            // console.log(r);
            test.equal(1, r.lastErrorObject.n);//no error
            test.equal(name, r.value.name);
            // test.equal(1, r.value.d);
            client.close();
            cb(r.value);
        });

    });
}

//update
exports.addNewRestaurantGrade = function (restaurant_id, gradeObj, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        var rest_object = {};

        collection.findOneAndUpdate(
            { restaurant_id: restaurant_id }
            , {
                $push: {
                    grades: { $each: [gradeObj], $sort: { date: -1 } }
                }
            }
            , {
                returnOriginal: false,
                upsert: false
            }
        ).then(function (r) {
            console.log(r);
            test.equal(1, r.lastErrorObject.n);//no error
            client.close();
            cb(r.valuer);
        });
    });
}

//delete
exports.deleteRestaurant = function (restaurant_id, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('DB connection Error.');
            throw err;
        }
        const collection = client.db("hw6").collection("restaurants");

        // Remove all the document
        collection.removeOne({ restaurant_id: restaurant_id }, { w: 1 }, function (err, r) {
            test.equal(null, err);
            test.equal(1, r.result.n);
            client.close();
            cb(r);
        });
    });

};