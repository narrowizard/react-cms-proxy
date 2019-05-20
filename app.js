var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var express = require('express');
var proxy = require('express-http-proxy');
var app = express();
var proxyReq = require('./proxy').proxyReq;
var proxyTable = require('./config').proxyTable;
var authProxyConfig = require('./config').authProxyConfig;
var pageRouter = require('./config').pageRouter;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());

app.use('/', express.static('app/build'));

if (pageRouter) {
    for (var p in pageRouter) {
        app.get(pageRouter[p], getpage);
    }
}

function getpage(req, res) {
    res.sendFile(path.join(__dirname + '/app/build/index.html'));
}

// setting proxy table
for (var segement in proxyTable) {
    app.use(segement, proxyReq);
}

// auth api 
app.use('/auth', proxy(authProxyConfig.protocol + "//" + authProxyConfig.hostname + ":" + authProxyConfig.port));
// app.use('/user', proxy('127.0.0.1:8888'));

module.exports = app;
