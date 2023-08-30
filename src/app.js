const Jwt = require('@hapi/jwt');
require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');
const JwtTokenManager = require('./Infrastructures/security/JwtTokenManager');

(async () => {
  const jwtTokenManager = new JwtTokenManager(Jwt.token);
  const server = await createServer(container, jwtTokenManager);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
