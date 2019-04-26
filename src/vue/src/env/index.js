const config = require('./_' + process.env.NODE_ENV);

export default class Environment {
   static get WEBSOCKET_URL() {
     return config.WEBSOCKET_URL;
   }
}