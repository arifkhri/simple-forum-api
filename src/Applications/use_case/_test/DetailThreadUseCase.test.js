const ThreadCommentRepository = require('../../../Domains/threadscomment/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the detail thread comment action correctly', async () => {
    const useCaseParams = {
      threadId: 'thread-id',
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();
    /** mocking needed function */
    mockThreadCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const detailThreadUseCase = new DetailThreadUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await detailThreadUseCase.execute(useCaseParams);

    // Assert
    expect(mockThreadCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockThreadRepository.getThread).toBeCalledWith(useCaseParams.threadId);
  });
});
