class DeleteThreadCommentUseCase {
  constructor({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCaseParams, userId) {
    const { threadId, commentId } = useCaseParams;
    await this._threadCommentRepository.verifyThreadCommentAvailability(commentId);

    return this._threadCommentRepository.deleteThreadComment({ commentId, userId, threadId });
  }
}

module.exports = DeleteThreadCommentUseCase;
