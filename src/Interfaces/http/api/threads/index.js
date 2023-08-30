const ThreadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { container, jwtTokenManager }) => {
    const threadsHandler = new ThreadsHandler(container, jwtTokenManager);
    server.route(routes(threadsHandler));
  },
};
