const NewThreadCommentPayload = require('../../Domains/threadscomment/entities/NewThreadCommentPayload');

class AddThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload, useCaseParams, userId) {
    const { threadId } = useCaseParams;
    const newThreadComment = new NewThreadCommentPayload(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(threadId);

    return this._threadCommentRepository.addThreadComment({
      ...newThreadComment, threadId, userId,
    });
  }
}

module.exports = AddThreadCommentUseCase;
