'use strict';
var configRoutes;

configRoutes = function(app, server) {
    app.get('/', function(request, response) {
        response.redirect('/index.html');
    });
}

module.exports = {configRoutes: configRoutes};