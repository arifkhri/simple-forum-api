class DeleteThreadCommentUseCase {
  constructor({ threadCommentRepository, authenticationTokenManager }) {
    this._threadCommentRepository = threadCommentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseParams, useCaseReqHeaders) {
    // verify token;
    const { authorization = '' } = useCaseReqHeaders;
    const token = authorization.replace('Bearer ', '');
    await this._authenticationTokenManager.verifyAccessToken(token);
    const tokenData = await this._authenticationTokenManager.decodePayload(token);

    const { threadId, commentId } = useCaseParams;
    await this._threadCommentRepository.getThreadComment(commentId);

    return this._threadCommentRepository.delThreadComment({ commentId, userId: tokenData?.id || '', threadId });
  }
}

module.exports = DeleteThreadCommentUseCase;
