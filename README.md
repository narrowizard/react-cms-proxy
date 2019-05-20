# react-cms
cotent manager system based on ant design.  

## usage
```
git clone https://github.com/narrowizard/react-cms.git
# install node proxy dependency
npm install
cd app
# install react app dependency.
npm install
# build react app
npm run build
cd ..
# start node proxy server
npm start
```

## config
config proxy info in `config.js`.
```js
/**
 * nirvana-cms-auth project host.
 */
exports.authProxyConfig = {
    protocol: "http:",
    hostname: "127.0.0.1",
    port: "8081",
}

/**
 * setting proxy table
 * tips: /auth router segement is kept to cms usage. 
 */
exports.proxyTable = {
    "/user": '10.0.0.236:8080' // nirvana-cms project host
    "/myapi": 'api.mydomain.com' // config your own proxy here, normally an intranet address.
}

/**
 * page router for production mode.
 */
exports.pageRouter = ["/login", "/layout", "/layout/*"]
```

## development
in develepment mode, static resource request will be proxy to `localhost:8080`(configured in `proxy` props of `app/package.json`).
```shell
npm start # start node proxy, default localhost:8080
cd app
npm start # run react dev server, default localhost:3000
```

## optimize
+ login field real-time validation.
+ cancel async request in componentDidUnMount
+ redirect to login page if request returns 403 Login:UnLoginError