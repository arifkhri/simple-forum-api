const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/DetailThreadUseCase');

class ThreadsHandler {
  constructor(container, jwtTokenManager) {
    this._container = container;
    this._jwtTokenManager = jwtTokenManager;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { authorization = '' } = request.headers;
    const token = authorization.replace('Bearer ', '');
    await this._jwtTokenManager.verifyAccessToken(token);
    const tokenData = await this._jwtTokenManager.decodePayload(token);
    const addedThread = await addThreadUseCase.execute({ ...request.payload }, tokenData?.id || '');

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
    const thread = await detailThreadUseCase.execute(request.params);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
