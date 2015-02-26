'use strict';
var configRoutes;
var mongo = require('./mongo');
var bodyParser = require('body-parser');

configRoutes = function(app, server) {
	app.use(bodyParser.urlencoded({extended: true}));

    app.get('/', function(req, res) {
        res.redirect('/index.html');
    });

    app.get('/api/find/:name', function(req, res) {
        mongo.find('palettes', {name: req.params.name}, {}, 
            function(list){
                res.send(list);
            }
        );
    });
    app.post('/api/update/:name', function(req, res) {
        var colors = req.body;
console.dir(colors);
        mongo.update('palettes', {name: req.params.name}, {name: req.params.name, palette: colors}, { upsert: true }, function(result) {
            res.send(result);
        });
    });
}

module.exports = {
    configRoutes: configRoutes
};