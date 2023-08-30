const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/DetailThreadUseCase');

class ThreadsHandler {
  constructor(container, jwtTokenManager) {
    this._container = container;
    this._jwtTokenManager = jwtTokenManager;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.delThreadCommentHandler = this.delThreadCommentHandler.bind(this);
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

  async postThreadCommentHandler(request, h) {
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
    const { authorization = '' } = request.headers;
    const token = authorization.replace('Bearer ', '');
    await this._jwtTokenManager.verifyAccessToken(token);
    const tokenData = await this._jwtTokenManager.decodePayload(token) || '';
    const addedComment = await addThreadCommentUseCase.execute(
      request.payload, request.params, tokenData?.id || '',
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async delThreadCommentHandler(request, h) {
    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
    const { authorization = '' } = request.headers;
    const token = authorization.replace('Bearer ', '');
    await this._jwtTokenManager.verifyAccessToken(token);
    const tokenData = await this._jwtTokenManager.decodePayload(token) || '';
    await deleteThreadCommentUseCase.execute(request.params, tokenData?.id || '');

    const response = h.response({
      status: 'success',
      data: {
        status: 'success',
      },
    });
    response.code(200);
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
