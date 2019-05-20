/**
 * nirvana-cms-auth project host.
 */
exports.authProxyConfig = {
    protocol: "http:",
    hostname: "10.0.0.12",
    port: "9588",
}

/**
 * setting proxy table
 * tips: /auth router segement is kept to cms usage. 
 */
exports.proxyTable = {
    "/user": '10.0.0.12:9589'
}

/**
 * page router for production mode.
 */
exports.pageRouter = ["/login", "/layout", "/layout/*"]