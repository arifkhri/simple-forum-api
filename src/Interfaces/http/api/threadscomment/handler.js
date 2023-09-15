const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class ThreadsCommentHandler {
  constructor(container, jwtTokenManager) {
    this._container = container;
    this._jwtTokenManager = jwtTokenManager;

    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
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

  async deleteThreadCommentHandler(request, h) {
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
}

module.exports = ThreadsCommentHandler;
