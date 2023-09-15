class DetailThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._threadCommentRepository.getCommentByThreadId(threadId);
    return { ...comments, ...thread };
  }
}

module.exports = DetailThreadUseCase;
