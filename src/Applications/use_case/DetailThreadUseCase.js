class DetailThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const comments = await this._threadCommentRepository.getCommentByThreadId(threadId);
    const thread = await this._threadRepository.getThread(threadId);
    return { ...comments, ...thread };
  }
}

module.exports = DetailThreadUseCase;
