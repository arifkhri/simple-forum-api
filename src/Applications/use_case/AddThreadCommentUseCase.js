const NewThreadComment = require('../../Domains/threadscomment/entities/NewThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseParams, useCaseReqHeaders) {
    // verify token;
    const { authorization = '' } = useCaseReqHeaders;
    const token = authorization.replace('Bearer ', '');
    await this._authenticationTokenManager.verifyAccessToken(token);
    const tokenData = await this._authenticationTokenManager.decodePayload(token);

    const { threadId } = useCaseParams;
    const newThreadComment = new NewThreadComment(useCasePayload);
    await this._threadRepository.getThread(threadId);

    return this._threadCommentRepository.addThreadComment({
      ...newThreadComment, threadId, userId: tokenData?.id || '',
    });
  }
}

module.exports = AddThreadCommentUseCase;
