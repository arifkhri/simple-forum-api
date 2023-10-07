class DeleteThreadCommentUseCase {
  constructor({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCaseParams, userId) {
    const { threadId, commentId } = useCaseParams;
    await this._threadCommentRepository.verifyThreadCommentAvailability(commentId);
    await this._threadCommentRepository.verifyThreadCommentAccess({ commentId, userId, threadId });

    return this._threadCommentRepository.deleteThreadComment({ commentId, userId, threadId });
  }
}

module.exports = DeleteThreadCommentUseCase;
