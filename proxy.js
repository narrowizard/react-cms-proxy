var http = require("http");
var proxy = require('express-http-proxy');
var authProxyConfig = require("./config").authProxyConfig;
var proxyTable = require("./config").proxyTable;
var requestLimit = require("./config").requestLimit;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.proxyReq = function (req, res, next) {
    var options = {
        path: "/user/authorize?request=" + req.baseUrl + req.path,
        headers: {}
    }
    if (req.headers["x-forwarded-for"]) {
        options.headers["x-forwarded-for"] = req.headers["x-forwarded-for"] + "," + req.connection.remoteAddress;
    } else {
        options.headers["x-forwarded-for"] = req.connection.remoteAddress;
    }
    if (req.headers.cookie) {
        // set cookie if exist
        options.headers.cookie = req.headers.cookie;
    }
    var config = Object.assign(options, authProxyConfig)
    var authRequest = http.get(config, (data) => {
        var resData = "";
        data.on("data", (chunk) => {
            resData += chunk;
        });
        data.on("end", () => {
            if (data.statusCode === 200) {
                let host = proxyTable[req.baseUrl];
                let prefix = "";
                if (typeof proxyTable[req.baseUrl] === "object") {
                    host = proxyTable[req.baseUrl].host;
                    prefix = proxyTable[req.baseUrl].prefix;
                }
                proxy(host, {
                    limit: requestLimit,
                    proxyReqPathResolver: function (req) {
                        var urlObject = require('url').parse(req.url, true);
                        urlObject.query["nirvanacmsuserid"] = +resData.trim();
                        return prefix + urlObject.pathname + "?" + require("querystring").stringify(urlObject.query);
                    }
                })(req, res, next)
            } else {
                res.writeHead(data.statusCode, data.headers);
                res.write(resData);
            }
        })
    });

    authRequest.on('error', (err) => {
        console.error(err)
        res.writeHead(502)
        res.end()
    });
}