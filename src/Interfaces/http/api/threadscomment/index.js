const ThreadsCommentHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threadscomment',
  register: async (server, { container, jwtTokenManager }) => {
    const threadsCommentHandler = new ThreadsCommentHandler(container, jwtTokenManager);
    server.route(routes(threadsCommentHandler));
  },
};
