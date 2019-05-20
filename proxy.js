var http = require("http");
var proxy = require('express-http-proxy');
var authProxyConfig = require("./config").authProxyConfig;
var proxyTable = require("./config").proxyTable;

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
                proxy(proxyTable[req.baseUrl], {
                    proxyReqPathResolver: function (req) {
                        var urlObject = require('url').parse(req.url, true);
                        urlObject.query["nirvanacmsuserid"] = +resData.trim();
                        return urlObject.pathname + "?" + require("querystring").stringify(urlObject.query);
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