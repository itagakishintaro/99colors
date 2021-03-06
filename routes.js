'use strict';
var configRoutes;
var mongo = require('./mongo');
var bodyParser = require('body-parser');
var crypto = require('crypto');

configRoutes = function(app, server) {
	app.use(bodyParser.urlencoded({extended: true}));

    app.get('/', function(req, res) {
        res.redirect('/index.html');
    });
    app.get('/:name', function(req, res) {
        res.redirect('/index.html#!name=' + req.params.name);
    });

	app.all('/api/*', function(req, res, next) {
	    res.contentType('json');
	    res.header('Access-Control-Allow-Origin', '*');
	    next();
	});

    app.get('/api/find/', function(req, res) {
        mongo.find('palettes', {}, {'_id':0, 'password':0}, 
            function(list){
                res.send(list);
            }
        );
    });
    app.get('/api/find/:name', function(req, res) {
        mongo.find('palettes', {name: req.params.name}, {'_id':0, 'password':0}, 
            function(list){
                res.send(list);
            }
        );
    });
    app.get('/api/findAllNames', function(req, res) {
        mongo.find('palettes', {}, {'_id':0, 'name':1}, 
            function(list){
            	var names = list.map(function(element){
            		return element.name;
            	});
                res.send(names);
            }
        );
    });
    app.get('/api/findTop10Names', function(req, res){
        mongo.find('palettes', {}, {'_id':0, 'name':1, limit:10, sort:{rating: -1}},
            function(list){
                var names = list.map(function(element){
                    return element.name;
                });
                res.send(names);
            }
        );
    });
    app.post('/api/update/:name', function(req, res) {
        var colors = req.body.colors;
        var password = req.body.password;
        var sha512 = crypto.createHash('sha512').update(password);
        var hash_password = sha512.digest('hex');

        mongo.find('palettes', {name: req.params.name}, {}, 
            function(list){
                if(list.length === 0) { // 初回はTweetCount=0
                    mongo.update('palettes', 
                        { name: req.params.name }, 
                        { name: req.params.name, password: hash_password, rating: 0, palette: colors }, 
                        { upsert: true }, 
                        function(result) {
                            res.send(result);
                        });
                } else if(hash_password === list[0].password){ // 2回目以降
			        mongo.update('palettes', 
			        	{ name: req.params.name }, 
			        	{ $set: { palette: colors } }, 
			        	{}, 
			        	function(result) {
				            res.send(result);
				        });
			    } else {
			    	res.send(401, 'Password Error');
			    } 
            }
        );
    });
    app.post('/api/updateRating/:name', function(req, res){
        mongo.find('palettes', { name: req.params.name }, { '_id':0, 'rating':1 }, 
            function(list){
                if(list.length !== 0){
                    var tweetCount = Number(list[0].tweetCount) + 1;
                    mongo.update('palettes', 
                        { name: req.params.name }, 
                        { $inc: { rating: 1 } },
                        {}, 
                        function(result) {
                            res.send(result);
                        });
                } else {
                    res.send(404, 'Not Found: ' + req.params.name );
                } 
            }
        );
    });
    app.post('/api/delete/:name', function(req, res){
    	var password = req.body.password;
        var sha512 = crypto.createHash('sha512').update(password);
        var hash_password = sha512.digest('hex');

        mongo.find('palettes', {name: req.params.name}, {}, 
            function(list){
                var db_password = list[0].password;
				if(hash_password === db_password){
			        mongo.remove('palettes', 
			        	{name: req.params.name}, 
			        	{}, 
			        	function(result) {
				            res.send(result);
				        });
			    } else {
			    	res.send(401, 'Password Error');
			    } 
            }
        );
    })
}

module.exports = {
    configRoutes: configRoutes
};